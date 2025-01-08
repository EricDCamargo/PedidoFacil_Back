import prismaClient from '../../prisma'

interface UpdateUserRequest {
  user_id: string
  name: string
  email: string
}

class UpdateUserService {
  async execute({ user_id, name, email }: UpdateUserRequest) {
    const user = await prismaClient.user.findFirst({
      where: { id: user_id }
    })
    if (!email) {
      throw new Error('Please enter a valid name and email address')
    }

    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: {
        name,
        email
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return updatedUser
  }
}

export { UpdateUserService }
