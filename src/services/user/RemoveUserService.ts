import prismaClient from '../../prisma'

interface UserRequest {
  user_id: string
}

class RemoveUserService {
  async execute({ user_id }: UserRequest) {
    if (!user_id) {
      throw new Error('User ID is required')
    }

    const userExists = await prismaClient.user.findFirst({
      where: {
        id: user_id
      }
    })

    if (!userExists) {
      throw new Error('User not found')
    }

    await prismaClient.user.delete({
      where: {
        id: user_id
      }
    })

    return { message: 'User successfully removed' }
  }
}

export { RemoveUserService }
