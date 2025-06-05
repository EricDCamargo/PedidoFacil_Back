import { Response, Request } from 'express'
import { ListLogsService } from '../../services/log/ListLogsService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListLogsController {
  async handle(req: Request, res: Response) {
    const user_id = req.query.user_id as string
    const startDate = req.query.startDate as string
    const endDate = req.query.endDate as string

    const listLogsService = new ListLogsService()

    try {
      const logs = await listLogsService.execute({
        user_id: user_id,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
      })

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
