import { AppResponse } from '../../@types/app.types'
import prismaClient from '../../prisma'

class ListLogsService {
  async execute(): Promise<AppResponse> {
    const logs = await prismaClient.log.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return { data: logs, message: 'List of logs' }
  }
}

export { ListLogsService }
