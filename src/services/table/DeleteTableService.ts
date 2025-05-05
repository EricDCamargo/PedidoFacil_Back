import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { OrderStatus } from '../../@types/types'
import { AppResponse } from '../../@types/app.types'
import prismaClient from '../../prisma'

interface DeleteTableRequest {
  table_id: string
}

class DeleteTableService {
  async execute({ table_id }: DeleteTableRequest): Promise<AppResponse> {
    // Verificar se o ID da mesa foi fornecido
    if (!table_id) {
      throw new AppError(
        'Necessário informar o ID da mesa!',
        StatusCodes.BAD_REQUEST
      )
    }

    // Buscar mesa com seus pedidos e pagamentos associados
    const table = await prismaClient.table.findUnique({
      where: { id: table_id },
      include: {
        orders: {
          include: {
            paymentOrders: {
              include: {
                payment: true // Incluir pagamentos associados ao pedido
              }
            }
          }
        }
      }
    })

    // Se a mesa não existir
    if (!table) {
      throw new AppError('Mesa não encontrada!', StatusCodes.NOT_FOUND)
    }

    // Verificar se há pedidos com pagamentos pendentes ou em andamento
    const hasActiveOrders = table.orders.some(order => {
      // Verificar se o pedido está em andamento ou se há pagamentos pendentes
      const orderHasPendingPayments = order.paymentOrders.some(paymentOrder => {
        return paymentOrder.payment && paymentOrder.payment.change !== null
      })
      return order.status !== OrderStatus.CLOSED || orderHasPendingPayments
    })

    // Obter números dos pedidos ativos
    const handleActiveOrders = () => {
      const activeOrders = table.orders.filter(order => {
        const orderHasPendingPayments = order.paymentOrders.some(
          paymentOrder => {
            return paymentOrder.payment && paymentOrder.payment.change !== null
          }
        )
        return order.status !== OrderStatus.CLOSED || orderHasPendingPayments
      })
      return activeOrders.map(order => order.number).join(', ')
    }

    // Se houver pedidos pendentes ou pagamentos incompletos, lançar erro
    if (hasActiveOrders) {
      throw new AppError(
        `A mesa não pode ser excluída porque possui pedidos em aberto ou pagamentos pendentes: ${handleActiveOrders()}`,
        StatusCodes.BAD_REQUEST
      )
    }

    // Excluir mesa, pois não há pedidos pendentes
    await prismaClient.table.delete({
      where: { id: table_id }
    })

    return { data: undefined, message: 'Mesa excluída com sucesso!' }
  }
}

export { DeleteTableService }
