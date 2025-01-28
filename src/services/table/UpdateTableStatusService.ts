import { AppResponse } from '../../@types/app.types'
import prismaClient from '../../prisma'

interface UpdateTableStatusRequest {
  table_id: string
  status: string
}

class UpdateTableStatusService {
  async execute({
    table_id,
    status
  }: UpdateTableStatusRequest): Promise<AppResponse> {
    const table = await prismaClient.table.findUnique({
      where: { id: table_id }
    })

    if (!table) {
      throw new Error('Mesa não encontrada.')
    }

    const updatedTable = await prismaClient.table.update({
      where: { id: table_id },
      data: { status }
    })

    return { data: updatedTable, message: 'Mesa editada com sucesso!' }
  }
}

export { UpdateTableStatusService }
