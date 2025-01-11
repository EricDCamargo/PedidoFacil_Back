import { OrderStatus, TableStatus } from '../../@types/types'
import prismaClient from '../../prisma'

interface OrderRequest {
  table_id: string
  name?: string
}

class CreateOrderService {
  async execute({ table_id, name }: OrderRequest) {
    const { draft, in_progress } = OrderStatus
    const { occupied } = TableStatus

    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new Error('Mesa não encontrada.')
    }

    const existingOrders = await prismaClient.order.findMany({
      where: {
        table_id,
        status: {
          in: [draft, in_progress]
        }
      }
    })

    if (existingOrders.length === 0) {
      await prismaClient.table.update({
        where: { id: table_id },
        data: { status: occupied }
      })
    }
    const order = await prismaClient.order.create({
      data: {
        table_id,
        name,
        status: draft
      }
    })

    return order
  }
}

export { CreateOrderService }
