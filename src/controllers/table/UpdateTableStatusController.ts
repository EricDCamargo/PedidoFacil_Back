import { Request, Response } from 'express'
import { UpdateTableStatusService } from '../../services/table/UpdateTableStatusService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class UpdateTableStatusController {
  async handle(req: Request, res: Response) {
    const { table_id, status } = req.body

    const updateTableStatusService = new UpdateTableStatusService()

    try {
      const table = await updateTableStatusService.execute({ table_id, status })
      return res.status(StatusCodes.OK).json(table)
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

export { UpdateTableStatusController }
