import { Request, Response } from 'express'
import { DeleteTableService } from '../../services/table/DeleteTableService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class DeleteTableController {
  async handle(req: Request, res: Response) {
    const table_id = req.query.table_id as string
    const deleteTableService = new DeleteTableService()

    try {
      const result = await deleteTableService.execute({ table_id })
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

export { DeleteTableController }
