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
    const { COMPLETED, PAID, IN_PROGRESS, CLOSED, DRAFT } = OrderStatus

    const order = await prismaClient.order.findUnique({
      where: { id: order_id },
      include: { paymentOrders: true }
    })

    if (!order) {
      throw new AppError('Pedido não encontrado!', StatusCodes.NOT_FOUND)
    }

    if (order.status === DRAFT) {
      throw new AppError(
        `Pedido com status 'RASCUNHO', não é possivel registrar o pagamento, mudar status do pedido!`,
        StatusCodes.BAD_REQUEST
      )
    }

    if (order.status === IN_PROGRESS) {
      throw new AppError(
        `Pedido com status 'EM PROGRESSO', finalizar entrega do pedido!`,
        StatusCodes.BAD_REQUEST
      )
    }

    if (order.status === PAID) {
      throw new AppError('Pedido já está pago!', StatusCodes.BAD_REQUEST)
    }

    if (order.status === CLOSED) {
      throw new AppError(
        'Pedido já está pago e fechado!',
        StatusCodes.BAD_REQUEST
      )
    }

    if (value <= 0) {
      throw new AppError(
        'Valor de pagamento deve ser maior que zero!',
        StatusCodes.BAD_REQUEST
      )
    }

    const orderValue = order.total || 0

    // Calcular o total pago
    const totalPaid = order.paymentOrders.reduce(
      (sum, paymentOrder) => sum + paymentOrder.value,
      0
    )

    // Calcular o troco (somente se o pagamento total exceder o valor do pedido)
    const change = totalPaid > orderValue ? totalPaid - orderValue : 0

    console.log('Valor do troco-> '+ change, 'Total pago ' + totalPaid)

    // Registrar o pagamento do pedido
    const paymentData: any = {
      value,
      payment_method,
      table_id: order.table_id,
      change: change
    }

    const payment = await prismaClient.payment.create({
      data: paymentData
    })

    // Criar PaymentOrder para associar o pagamento ao pedido
    const paymentOrder = await prismaClient.paymentOrder.create({
      data: {
        payment_id: payment.id,
        order_id,
        value
      }
    })

    // Se o pagamento do pedido for quitado, mudar o status para PAID
    if (totalPaid >= orderValue) {
      await prismaClient.order.update({
        where: { id: order_id },
        data: { status: PAID }
      })
    }

    return {
      data: paymentOrder,
      message: `Pagamento registrado para o pedido ${order.number} com sucesso!`
    }
  }
}

export { PartialPaymentOrderService }
