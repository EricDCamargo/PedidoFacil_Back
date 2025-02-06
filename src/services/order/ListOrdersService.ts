import { Prisma } from '@prisma/client'
import prismaClient from '../../prisma'
import { OrderStatus } from '../../@types/types'
import { AppResponse } from '../../@types/app.types'

interface ListOrdersRequest {
  table_id: string
}

class ListOrdersService {
  async execute({ table_id }: ListOrdersRequest): Promise<AppResponse> {
    const { DRAFT, IN_PROGRESS, COMPLETED, PAID } = OrderStatus
    const filter: Prisma.OrderWhereInput = {
      status: {
        in: [DRAFT, IN_PROGRESS, COMPLETED, PAID]
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
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
                category: true
              }
            }
          }
        },
        paymentOrders: {
          include: {
            payment: true
          }
        }
      }
    })

    return { data: orders, message: 'Lista de pedidos por mesa' }
  }
}

export { ListOrdersService }
