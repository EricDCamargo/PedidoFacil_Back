import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { OrderStatus, TableStatus } from '../../@types/types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface CloseTableRequest {
  table_id: string
  payment_method: string
}

class CloseTableService {
  async execute({
    table_id,
    payment_method
  }: CloseTableRequest): Promise<AppResponse> {
    const { AVAILABLE, OCCUPIED } = TableStatus
    const { COMPLETED, CLOSED } = OrderStatus
    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new AppError('Mesa não encontrada!', StatusCodes.NOT_FOUND)
    }

    if (table.status !== OCCUPIED) {
      throw new AppError('A mesa não está ocupada!', StatusCodes.BAD_REQUEST)
    }

    if (!payment_method) {
      throw new AppError(
        'Forma de pagamento não informada!',
        StatusCodes.BAD_REQUEST
      )
    }

    const orders = await prismaClient.order.findMany({
      where: { table_id, status: COMPLETED }
    })

    if (orders.length === 0) {
      throw new AppError('Não há pedidos para fechar!', StatusCodes.BAD_REQUEST)
    }

    const totalValue = orders.reduce(
      (total, order) => total + (order.total || 0),
      0
    )

    await prismaClient.payment.create({
      data: {
        order_id: orders[0].id,
        value: totalValue,
        payment_method
      }
    })

    await prismaClient.order.updateMany({
      where: { table_id, status: COMPLETED },
      data: { status: CLOSED }
    })

    await prismaClient.table.update({
      where: { id: table_id },
      data: { status: AVAILABLE }
    })

    return { data: undefined, message: 'Conta fechada com sucesso!' }
  }
}

export { CloseTableService }
