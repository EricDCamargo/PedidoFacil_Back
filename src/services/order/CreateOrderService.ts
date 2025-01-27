import { OrderStatus, TableStatus } from '../../@types/types'
import prismaClient from '../../prisma'

interface OrderRequest {
  table_id: string
  name?: string
}

class CreateOrderService {
  async execute({ table_id, name }: OrderRequest) {
    const { DRAFT, IN_PROGRESS } = OrderStatus
    const { OCCUPIED } = TableStatus

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
          in: [DRAFT, IN_PROGRESS]
        }
      }
    })

    if (existingOrders.length === 0) {
      await prismaClient.table.update({
        where: { id: table_id },
        data: { status: OCCUPIED }
      })
    }
    const order = await prismaClient.order.create({
      data: {
        table_id,
        name,
        status: DRAFT
      }
    })

    return order
  }
}

export { CreateOrderService }
