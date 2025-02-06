import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { OrderStatus } from '../../@types/types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface PartialPaymentOrderRequest {
  order_id: string
  payment_method: string
  value: number
}

class PartialPaymentOrderService {
  async execute({
    order_id,
    payment_method,
    value
  }: PartialPaymentOrderRequest): Promise<AppResponse> {
    const { PAID, IN_PROGRESS, CLOSED, DRAFT } = OrderStatus

    if (!order_id || !payment_method || !value || value <= 0) {
      throw new AppError(
        'Dados do pagamento inválidos!',
        StatusCodes.BAD_REQUEST
      )
    }

    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { paymentOrders: true }
    })

    if (!order) {
      throw new AppError('Pedido não encontrado!', StatusCodes.NOT_FOUND)
    }

    if ([DRAFT, IN_PROGRESS, CLOSED].includes(order.status as OrderStatus)) {
      throw new AppError(
        `Pedido com status '${order.status}', não é possível registrar pagamento!`,
        StatusCodes.BAD_REQUEST
      )
    }

    const orderValue = order.total || 0

    // Calcular o total pago
    const totalPaid = order.paymentOrders.reduce(
      (sum, paymentOrder) => sum + paymentOrder.value,
      0
    )

    if (totalPaid >= orderValue) {
      throw new AppError(
        `Pedido ${order.number} já está totalmente pago!`,
        StatusCodes.BAD_REQUEST
      )
    }

    const newTotalPaid = totalPaid + value

    // Calcular o troco (somente se o pagamento total exceder o valor do pedido)
    const change = newTotalPaid > orderValue ? newTotalPaid - orderValue : 0

    console.log('Total pago ate então ' + totalPaid)
    console.log('Novo total pago ' + newTotalPaid)
    console.log('Valor do troco-> ' + change)
    // Registrar o pagamento do pedido
    const payment = await prismaClient.payment.create({
      data: {
        value,
        payment_method,
        table_id: order.table_id,
        change
      }
    })

    // Criar PaymentOrder para associar o pagamento ao pedido
    await prismaClient.paymentOrder.create({
      data: {
        payment_id: payment.id,
        order_id,
        value
      }
    })

    // Se o pagamento do pedido for quitado, mudar o status para PAID
    if (newTotalPaid >= orderValue && order.status !== PAID) {
      await prismaClient.order.update({
        where: { id: order_id },
        data: { status: PAID }
      })
    }

    return {
      data: payment,
      message: `Pagamento registrado para o pedido ${order.number} com sucesso!`
    }
  }
}

export { PartialPaymentOrderService }
