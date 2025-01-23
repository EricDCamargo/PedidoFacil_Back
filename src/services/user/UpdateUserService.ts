import { Role } from '../../@types/types'
import prismaClient from '../../prisma'

interface UpdateUserRequest {
  user_id: string
  name: string
  email: string
  role: Role
}

class UpdateUserService {
  async execute({ user_id, name, email, role }: UpdateUserRequest) {
    const user = await prismaClient.user.findFirst({
      where: { id: user_id }
    })
    if (!email) {
      throw {
        statusCode: 400,
        message: 'Please enter a valid name and email address'
      }
    }

    if (!user) {
      throw { statusCode: 404, message: 'User not found' }
    }

    const updatedUser = await prismaClient.user.update({
      where: { id: user_id },
      data: {
        name,
        email,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return updatedUser
  }
}

export { UpdateUserService }
