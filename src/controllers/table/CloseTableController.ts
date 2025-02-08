import { Request, Response } from 'express'
import { CloseTableService } from '../../services/table/CloseTableService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class CloseTableController {
  async handle(req: Request, res: Response) {
    const table_id = req.query.table_id as string

    const closeTableService = new CloseTableService()

    try {
      const result = await closeTableService.execute({
        table_id
      })
      return res.status(StatusCodes.OK).json(result)
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

export { CloseTableController }
