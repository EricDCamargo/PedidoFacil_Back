import { Request, Response } from 'express'
import { CreateTableService } from '../../services/table/CreateTableService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class CreateTableController {
  async handle(req: Request, res: Response) {
    const { number } = req.body
    const createTableService = new CreateTableService()

    try {
      const table = await createTableService.execute({ number })

      return res.status(StatusCodes.CREATED).json(table)
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

export { CreateTableController }
