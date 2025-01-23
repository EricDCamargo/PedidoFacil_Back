import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'

interface UserRequest {
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'USER'
}

class CreateUserServices {
  async execute({ name, email, password, role }: UserRequest) {
    if (!email || !password || !name) {
      throw {
        statusCode: 400,
        message: 'Name, email, and password are required'
      }
    }

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    })

    if (userAlreadyExists) {
      throw { statusCode: 409, message: 'User already exists' }
    }

    const passwordHash = await hash(password, 8)
    try {
      const user = await prismaClient.user.create({
        data: {
          name: name,
          email: email,
          password: passwordHash,
          role: role || 'USER'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      })
      return user
    } catch (error) {
      throw { statusCode: 500, message: 'Error creating user' }
    }
  }
}

export { CreateUserServices }
