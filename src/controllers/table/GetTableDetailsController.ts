import { Request, Response } from 'express'
import { GetTableDetailsService } from '../../services/table/GetTableDetailsService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class GetTableDetailsController {
  async handle(req: Request, res: Response) {
    const { table_id } = req.query

    const getTableDetailsService = new GetTableDetailsService()

    try {
      const table = await getTableDetailsService.execute({
        table_id: table_id as string
      })
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

export { GetTableDetailsController }
