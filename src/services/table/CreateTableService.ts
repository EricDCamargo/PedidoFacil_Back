import prismaClient from '../../prisma'

interface TableRequest {
  number: number
}

class CreateTableService {
  async execute({ number }: TableRequest) {
    // Verificar se a mesa já existe
    const tableExists = await prismaClient.table.findUnique({
      where: { number }
    })

    if (tableExists) {
      throw new Error('Mesa já cadastrada.')
    }

    // Criar a nova mesa
    const table = await prismaClient.table.create({
      data: {
        number,
        status: 'available'
      }
    })

    return table
  }
}

export { CreateTableService }