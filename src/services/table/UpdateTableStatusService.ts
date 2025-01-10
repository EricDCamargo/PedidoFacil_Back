import prismaClient from '../../prisma'

interface UpdateTableStatusRequest {
  table_id: string
  status: string
}

class UpdateTableStatusService {
  async execute({ table_id, status }: UpdateTableStatusRequest) {
    // Verificar se a mesa existe
    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new Error('Mesa não encontrada.')
    }

    // Atualizar o status da mesa
    const updatedTable = await prismaClient.table.update({
      where: { id: table_id },
      data: { status }
    })

    return updatedTable
  }
}

export { UpdateTableStatusService }