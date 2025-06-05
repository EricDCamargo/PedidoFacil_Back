import { AppResponse } from '../../@types/app.types'
import prismaClient from '../../prisma'

interface ListLogsParams {
  user_id?: string
  startDate?: Date
  endDate?: Date
}

class ListLogsService {
  async execute({
    user_id,
    startDate,
    endDate
  }: ListLogsParams): Promise<AppResponse> {
    const where: any = {}

    if (user_id) {
      where.user_id = user_id
    }

    if (startDate || endDate) {
      where.created_at = {}
      if (startDate) {
        where.created_at.gte = startDate
      }
      if (endDate) {
        where.created_at.lte = endDate
      }
    }

    const logs = await prismaClient.log.findMany({
      where,
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
