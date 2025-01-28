import { AppResponse } from '../../@types/app.types'
import prismaClient from '../../prisma'

class ListUsersService {
  async execute(): Promise<AppResponse> {
    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true
      }
    })

    return { data: users, message: 'Lista de usuarios' }
  }
}

export { ListUsersService }
