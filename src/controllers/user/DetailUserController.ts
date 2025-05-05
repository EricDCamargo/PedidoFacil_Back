import { Request, Response } from 'express'
import { DetailUserService } from '../../services/user/DetailUserService'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'

class DetailUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id

    const detailUserService = new DetailUserService()

    try {
      const user = await detailUserService.execute(user_id)
      return res.status(StatusCodes.OK).json(user)
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
export { DetailUserController }
