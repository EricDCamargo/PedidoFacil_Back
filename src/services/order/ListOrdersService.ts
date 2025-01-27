import { Prisma } from '@prisma/client'
import prismaClient from '../../prisma'
import { OrderStatus } from '../../@types/types'

interface ListOrdersRequest {
  table_id: string
}

class ListOrdersService {
  async execute({ table_id }: ListOrdersRequest) {
    const { DRAFT, IN_PROGRESS, COMPLETED } = OrderStatus
    const filter: Prisma.OrderWhereInput = {
      status: {
        in: [DRAFT, IN_PROGRESS, COMPLETED]
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
