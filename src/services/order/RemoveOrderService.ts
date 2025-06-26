import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import { OrderStatus, TableStatus } from '../../@types/types'
import prismaClient from '../../prisma'
import { SocketEvents } from '../../@types/socket'
import { emitSocketEvent } from '../../utils/socket'

interface OrderRequest {
  order_id: string
}

class RemoveOrderService {
  async execute({ order_id }: OrderRequest): Promise<AppResponse> {
    const { COMPLETED, PAID, CLOSED } = OrderStatus
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: {
        items: true
      }
    })

    if (!order) {
      throw new AppError('Pedido não encontrado.', StatusCodes.NOT_FOUND)
    }

    if (order.status === COMPLETED) {
      throw new AppError(
        'O pedido não pode ser removido pois já foi ENTREGUE.',
        StatusCodes.BAD_REQUEST
      )
    }
    if (order.status === PAID) {
      throw new AppError(
        'O pedido não pode ser removido pois já foi PAGO.',
        StatusCodes.BAD_REQUEST
      )
    }
    if (order.status === CLOSED) {
      throw new AppError(
        'O pedido não pode ser removido pois já foi FECHADO.',
        StatusCodes.BAD_REQUEST
      )
    }

    if (order.items.length > 0) {
      await prismaClient.item.deleteMany({
        where: { order_id }
      })
    }

    const deletedOrder = await prismaClient.order
      .delete({
        where: { id: order_id }
      })
      .then(() =>
        emitSocketEvent(SocketEvents.ORDER_CHANGED, {
          table_id: order.table_id
        })
      )

    // Check if there are any remaining orders for the table
    const hasRemainingOrders = await prismaClient.order.findFirst({
      where: {
        table_id: order.table_id,
        status: {
          not: OrderStatus.CLOSED
        }
      }
    })

    if (!hasRemainingOrders) {
      await prismaClient.table.update({
        where: { id: order.table_id },
        data: { status: TableStatus.AVAILABLE }
      })
      emitSocketEvent(SocketEvents.TABLE_STATUS_CHANGED)
    }

    return { data: deletedOrder, message: 'Pedido removido com sucesso.' }
  }
}

export { RemoveOrderService }
