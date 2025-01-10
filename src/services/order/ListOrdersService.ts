import { Prisma } from '@prisma/client'
import prismaClient from '../../prisma'

interface ListOrdersRequest {
  table_id: string
}

class ListOrdersService {
  async execute({ table_id }: ListOrdersRequest) {
    const filter: Prisma.OrderWhereInput = {
      status: {
        in: ['draft', 'in_progress', 'completed']
      }
    }

    if (table_id) {
      filter.table_id = table_id
    }

    const orders = await prismaClient.order.findMany({
      where: filter,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        table: true,
        payments: true
      }
    })

    return orders
  }
}

export { ListOrdersService }