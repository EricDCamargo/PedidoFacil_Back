import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import { OrderStatus } from '../../@types/types'
import prismaClient from '../../prisma'

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

    const deletedOrder = await prismaClient.order.delete({
      where: { id: order_id }
    })

    return { data: deletedOrder, message: 'Pedido removido com sucesso.' }
  }
}

export { RemoveOrderService }
