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
    const { PAID, COMPLETED, CLOSED } = OrderStatus

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

    // Get the total of paid and completed orders
    const { _sum: { total: totalOrders = 0 } = {} } =
      await prismaClient.order.aggregate({
        where: { table_id, status: { in: [PAID, COMPLETED] } },
        _sum: { total: true }
      })

    // Get the total of payments made
    const { _sum: { value: totalPayments = 0 } = {} } =
      await prismaClient.paymentOrder.aggregate({
        where: { order: { table_id, status: { in: [PAID, COMPLETED] } } },
        _sum: { value: true }
      })

    // Validation: were all paid orders paid off?
    if (totalPayments < totalOrders) {
      throw new AppError(
        'Nem todos os pedidos pagos foram quitados!',
        StatusCodes.BAD_REQUEST
      )
    }

    await prismaClient.order.updateMany({
      where: { table_id, status: PAID },
      data: { status: CLOSED }
    })

    await prismaClient.table.update({
      where: { id: table_id },
      data: { status: AVAILABLE }
    })

    return { message: 'Mesa fechada com sucesso!' }
  }
}

export { CloseTableService }
