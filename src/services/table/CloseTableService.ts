import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { OrderStatus, TableStatus } from '../../@types/types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface CloseTableRequest {
  table_id: string
}

class CloseTableService {
  async execute({ table_id }: CloseTableRequest): Promise<AppResponse> {
    const { AVAILABLE, OCCUPIED } = TableStatus
    const { PAID, CLOSED } = OrderStatus

    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new AppError('Mesa não encontrada!', StatusCodes.NOT_FOUND)
    }

    if (table.status !== OCCUPIED) {
      throw new AppError('A mesa não está ocupada!', StatusCodes.BAD_REQUEST)
    }

    const orders = await prismaClient.order.findMany({
      where: { table_id },
      include: { paymentOrders: true }
    })

    if (orders.length === 0) {
      throw new AppError('Não há pedidos nessa mesa!', StatusCodes.BAD_REQUEST)
    }

    // Verificar se existem pedidos não pagos
    const unpaidOrders = orders.filter(order => order.status !== PAID)
    if (unpaidOrders.length > 0) {
      throw new AppError(
        'Não é possível fechar a mesa: existem pedidos não pagos!',
        StatusCodes.BAD_REQUEST
      )
    }

    // Verificar se todos os pedidos pagos estão quitados
    const allPaidOrdersFullyPaid = orders.every(order => {
      if (order.status !== PAID) return false // Se o pedido não for pago, ele não deve ser considerado quitado

      const totalOrderValue = order.total || 0
      const totalPaidForOrder = order.paymentOrders.reduce(
        (sum, paymentOrder) => sum + (paymentOrder.value || 0),
        0
      )

      return totalPaidForOrder >= totalOrderValue
    })

    if (!allPaidOrdersFullyPaid) {
      throw new AppError(
        'Nem todos os pedidos pagos foram quitados!',
        StatusCodes.BAD_REQUEST
      )
    }

    // Atualizar pedidos para "CLOSED"
    await prismaClient.order.updateMany({
      where: { table_id, status: PAID },
      data: { status: CLOSED }
    })

    // Atualizar status da mesa para "AVAILABLE"
    await prismaClient.table.update({
      where: { id: table_id },
      data: { status: AVAILABLE }
    })

    return { message: 'Mesa fechada com sucesso!' }
  }
}

export { CloseTableService }
