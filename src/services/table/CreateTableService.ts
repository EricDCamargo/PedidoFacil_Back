import { StatusCodes } from 'http-status-codes'
import { TableStatus } from '../../@types/types'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../prisma'
import { AppResponse } from '../../@types/app.types'

interface TableRequest {
  number: string
}

class CreateTableService {
  async execute({ number }: TableRequest): Promise<AppResponse> {
    const { AVAILABLE } = TableStatus

    if (!number) {
      throw new AppError(
        'Necessario informar numero da mesa!',
        StatusCodes.BAD_REQUEST
      )
    }

    const tableExists = await prismaClient.table.findUnique({
      where: { number }
    })

    if (tableExists) {
      throw new AppError('Mesa ja existe!', StatusCodes.CONFLICT)
    }

    const table = await prismaClient.table.create({
      data: {
        number,
        status: AVAILABLE
      }
    })

    return { data: table, message: 'Mesa criada com sucesso!' }
  }
}

export { CreateTableService }
