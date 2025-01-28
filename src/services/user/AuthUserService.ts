import prismaClient from '../../prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { AppResponse } from '../../@types/app.types'

interface AuthRequest {
  email: string
  password: string
}

class AuthUserService {
  async execute({ email, password }: AuthRequest): Promise<AppResponse> {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    })

    if (!user) {
      throw new Error('Usuario não encontrado, credenciais incoretas!')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Senha incoreta!')
    }

    const token = sign(
      { name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '30d'
      }
    )

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      },
      message: 'Login feito com sucesso!'
    }
  }
}
export { AuthUserService }
