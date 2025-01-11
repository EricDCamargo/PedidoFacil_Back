import prismaClient from '../../prisma'

interface GetTableDetailsRequest {
  table_id: string
}

class GetTableDetailsService {
  async execute({ table_id }: GetTableDetailsRequest) {
    const table = await prismaClient.table.findUnique({
      where: { id: table_id },
      include: {
        orders: true
      }
    })

    if (!table) {
      throw new Error('Mesa não encontrada.')
    }

    return table
  }
}

export { GetTableDetailsService }
