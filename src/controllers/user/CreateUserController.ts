import { Request, Response } from 'express'
import { CreateUserService } from '../../services/user/CreateUserService'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, role } = req.body
    const createUserService = new CreateUserService()

    try {
      const user = await createUserService.execute({
        name,
        email,
        password,
        role
      })
      return res.status(StatusCodes.CREATED).json(user)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }
}

export { CreateUserController }
