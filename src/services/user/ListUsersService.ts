import prismaClient from '../../prisma'

class ListUsersService {
  async execute() {
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

    return users
  }
}

export { ListUsersService }
