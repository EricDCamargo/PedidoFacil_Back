import { TableStatus } from '../../@types/types'
import prismaClient from '../../prisma'

interface TableRequest {
  number: string
}

class CreateTableService {
  async execute({ number }: TableRequest) {
    const { AVAILABLE } = TableStatus

    const tableExists = await prismaClient.table.findUnique({
      where: { number }
    })

    if (tableExists) {
      throw new Error('Mesa já cadastrada.')
    }

    const table = await prismaClient.table.create({
      data: {
        number,
        status: AVAILABLE
      }
    })

    return table
  }
}

export { CreateTableService }
