import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import { OrderStatus } from '../../@types/types'
import prismaClient from '../../prisma'
import { SocketEvents } from '../../@types/socket'
import { emitSocketEvent } from '../../utils/socket'

interface SendOrderRequest {
  order_id: string
}

class SendOrderService {
  async execute({ order_id }: SendOrderRequest): Promise<AppResponse> {
    const { DRAFT, IN_PROGRESS } = OrderStatus
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { items: true }
    })

    if (!order) {
      throw new AppError('Pedido não encontrado.', StatusCodes.NOT_FOUND)
    }

    if (order.status !== DRAFT) {
      throw new AppError(
        'Pedido já encaminhado para a cozinha.',
        StatusCodes.BAD_REQUEST
      )
    }

    if (order.total <= 0) {
      throw new AppError(
        'Não é possível encaminhar um pedido com total zero.',
        StatusCodes.BAD_REQUEST
      )
    }

    if (order.items.length === 0) {
      throw new AppError(
        'Não é possível encaminhar um pedido sem itens.',
        StatusCodes.BAD_REQUEST
      )
    }

    // Atualizar o status do pedido
    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: IN_PROGRESS, updated_at: new Date() }
    })
    emitSocketEvent(SocketEvents.ORDER_CHANGED, { table_id: order.table_id })

    // Buscar o pedido atualizado com os relacionamentos necessários
    const updatedOrder = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { items: { include: { product: true } } }
    })

    return { data: updatedOrder, message: 'Pedido enviado para a cozinha!' }
  }
}

export { SendOrderService }
