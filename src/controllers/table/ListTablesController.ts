import { Request, Response } from 'express'
import { ListTablesService } from '../../services/table/ListTablesService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListTablesController {
  async handle(req: Request, res: Response) {
    const listTablesService = new ListTablesService()

    try {
      const tables = await listTablesService.execute()
      return res.status(StatusCodes.OK).json(tables)
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

export { ListTablesController }
