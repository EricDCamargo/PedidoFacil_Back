import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { OrderStatus, TableStatus } from '../../@types/types'
import { AppResponse } from '../../@types/app.types'

interface DeleteTableRequest {
  table_id: string
}

class DeleteTableService {
  async execute({ table_id }: DeleteTableRequest): Promise<AppResponse> {
    const table = await prismaClient.table.findUnique({
      where: { id: table_id },
      include: { orders: true }
    })

    if (!table_id) {
      throw new AppError(
        'Necessario informar o ID da mesa!',
        StatusCodes.BAD_REQUEST
      )
    }

    if (!table) {
      throw new AppError('Mesa não encontrada!', StatusCodes.NOT_FOUND)
    }

    // Is there any open order in this table?
    const hasActiveOrders = table.orders.some(
      order => order.status !== OrderStatus.CLOSED
    )
    // Get open orders numbers
    const handleActiveOrders = () => {
      const activeOrders = table.orders.filter(
        order => order.status !== OrderStatus.CLOSED
      )
      return activeOrders.map(order => order.number).join(', ')
    }
    // Return erro in case of open orders
    if (hasActiveOrders) {
      throw new AppError(
        `A mesa não pode ser excluída porque possui pedidos em aberto: ${handleActiveOrders()}`,
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
