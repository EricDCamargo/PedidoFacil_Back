import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { AppResponse } from '../../@types/app.types'
import prismaClient from '../../prisma'

interface GetTableDetailsRequest {
  table_id: string
}

class GetTableDetailsService {
  async execute({ table_id }: GetTableDetailsRequest): Promise<AppResponse> {
    const table = await prismaClient.table.findUnique({
      where: { id: table_id },
      include: {
        orders: true
      }
    })

    if (!table) {
      throw new AppError('Mesa não encontrada!', StatusCodes.NOT_FOUND)
    }

    return { data: table, message: 'Mesa ativa!' }
  }
}

export { GetTableDetailsService }
