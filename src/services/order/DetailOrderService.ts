import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'

interface DetailRequest {
  order_id: string
}

class DetailOrderService {
  async execute({ order_id }: DetailRequest): Promise<AppResponse> {
    // Buscando o pedido com os itens e pagamentos
    const order = await prismaClient.order.findUnique({
      where: {
        id: order_id
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        table: true,
        paymentOrders: {
          include: {
            payment: true
          }
        }
      }
    })

    if (!order) {
      throw new AppError('Pedido não encontrado.', StatusCodes.NOT_FOUND)
    }

    return {
      data: order,
      message: 'Detalhes do pedido encontrados com sucesso.'
    }
  }
}

export { DetailOrderService }
