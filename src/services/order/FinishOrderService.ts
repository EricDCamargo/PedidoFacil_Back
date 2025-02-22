import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import { OrderStatus } from '../../@types/types'
import prismaClient from '../../prisma'

interface OrderRequest {
  order_id: string
}

class FinishOrderService {
  async execute({ order_id }: OrderRequest): Promise<AppResponse> {
    const { IN_PROGRESS, COMPLETED } = OrderStatus
    const order = await prismaClient.order.findUnique({
      where: { id: order_id }
    })

    if (!order) {
      throw new AppError('Pedido não encontrado.', StatusCodes.NOT_FOUND)
    }

    if (order.status !== IN_PROGRESS) {
      throw new AppError(
        'O pedido não está EM PROGRESSO.',
        StatusCodes.BAD_REQUEST
      )
    }

    const updatedOrder = await prismaClient.order.update({
      where: { id: order_id },
      data: { status: COMPLETED, updated_at: new Date() }
    })

    return { data: updatedOrder, message: 'Pedido finalizado com sucesso!' }
  }
}

export { FinishOrderService }
