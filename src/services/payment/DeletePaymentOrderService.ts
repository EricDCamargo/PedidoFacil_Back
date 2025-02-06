import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { OrderStatus } from '../../@types/types'

interface DeletePaymentOrderRequest {
  order_id: string
}

class DeletePaymentOrderService {
  async execute({ order_id }: DeletePaymentOrderRequest) {
    const { COMPLETED, PAID } = OrderStatus
    // Verifica se o pedido existe
    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { paymentOrders: true }
    })

    if (!order) {
      throw new AppError('Pedido não encontrado!', StatusCodes.NOT_FOUND)
    }

    // Verifica se o pagamento existe para o pedido
    if (order.paymentOrders.length === 0) {
      throw new AppError(
        'Nenhum pagamento encontrado para este pedido!',
        StatusCodes.NOT_FOUND
      )
    }

    // Deleta todos os pagamentos associados ao pedido
    await prismaClient.paymentOrder.deleteMany({
      where: { order_id }
    })

    // Atualiza o status do pedido para 'COMPLETED'
    await prismaClient.order.update({
      where: { id: order_id },
      data: { status: COMPLETED }
    })

    return {
      message: 'Pagamento do pedido deletado e status alterado para COMPLETED!'
    }
  }
}

export { DeletePaymentOrderService }
