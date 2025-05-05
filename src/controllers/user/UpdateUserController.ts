import { Request, Response } from 'express'
import { UpdateUserService } from '../../services/user/UpdateUserService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string
    const { name, email, role } = req.body

    const updateUserService = new UpdateUserService()

    try {
      const updatedUser = await updateUserService.execute({
        user_id,
        name,
        email,
        role
      })
      return res.status(StatusCodes.OK).json(updatedUser)
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

export { UpdateUserController }
