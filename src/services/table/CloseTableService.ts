import { OrderStatus, TableStatus } from '../../@types/types'
import prismaClient from '../../prisma'

interface CloseTableRequest {
  table_id: string
  payment_method: string
}

class CloseTableService {
  async execute({ table_id, payment_method }: CloseTableRequest) {
    const { AVAILABLE, OCCUPIED } = TableStatus
    const { COMPLETED, CLOSED } = OrderStatus
    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new Error('Mesa não encontrada.')
    }

    if (table.status !== OCCUPIED) {
      throw new Error('A mesa não está ocupada.')
    }

    if (!payment_method) {
      throw new Error('Forma de pagamento não informada.')
    }

    const orders = await prismaClient.order.findMany({
      where: { table_id, status: COMPLETED }
    })

    if (orders.length === 0) {
      throw new Error('Não há pedidos para fechar.')
    }

    const totalAmount = orders.reduce(
      (total, order) => total + (order.total || 0),
      0
    )

    await prismaClient.payment.create({
      data: {
        order_id: orders[0].id,
        amount: totalAmount,
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

    return { message: 'Conta fechada com sucesso' }
  }
}

export { CloseTableService }
