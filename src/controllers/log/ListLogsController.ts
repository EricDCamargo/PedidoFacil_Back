import { Response, Request } from 'express'
import { ListLogsService } from '../../services/log/ListLogsService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListLogsController {
  async handle(req: Request, res: Response) {
    const listLogsService = new ListLogsService()

    try {
      const logs = await listLogsService.execute()

      return res.status(StatusCodes.OK).json(logs)
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

export { ListLogsController }
