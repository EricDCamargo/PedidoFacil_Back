import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { OrderStatus } from '../../@types/types'

interface DeletePaymentRequest {
  payment_id: string
}

class DeletePaymentOrderService {
  async execute({ payment_id }: DeletePaymentRequest) {
    if (!payment_id) {
      throw new AppError('ID do pagamento necessario!', StatusCodes.BAD_REQUEST)
    }

    const payment = await prismaClient.payment.findUnique({
      where: { id: payment_id },
      include: { paymentOrders: true }
    })

    if (!payment) {
      throw new AppError('Pagamento não encontrado!', StatusCodes.NOT_FOUND)
    }

    const paymentOrder = payment.paymentOrders[0]
    if (!paymentOrder) {
      throw new AppError(
        'Pagamento não está associado a um pedido!',
        StatusCodes.BAD_REQUEST
      )
    }

    const order_id = paymentOrder.order_id

    // Deletar registros na tabela PaymentOrder primeiro
    await prismaClient.paymentOrder.deleteMany({
      where: { payment_id }
    })

    // Após remover as referências, deletar o pagamento
    await prismaClient.payment.delete({
      where: { id: payment_id }
    })

    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { paymentOrders: true }
    })

    const totalPaid = order.paymentOrders.reduce((sum, p) => sum + p.value, 0)

    if (totalPaid < order.total) {
      await prismaClient.order.update({
        where: { id: order_id },
        data: { status: OrderStatus.COMPLETED }
      })
    }

    return {
      message: 'Pagamento removido com sucesso!'
    }
  }
}

export { DeletePaymentOrderService }
