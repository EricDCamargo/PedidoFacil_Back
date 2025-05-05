import { AppResponse } from '../../@types/app.types'
import prismaClient from '../../prisma'

class ListTablesService {
  async execute(): Promise<AppResponse> {
    const tables = await prismaClient.table.findMany({
      orderBy: {
        number: 'asc'
      }
    })

    return { data: tables, message: 'Lista de messas!' }
  }
}

export { ListTablesService }
