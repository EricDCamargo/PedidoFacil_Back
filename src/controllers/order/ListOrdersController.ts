import { Response, Request } from 'express'
import { ListOrdersService } from '../../services/order/ListOrdersService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class ListOrdersController {
  async handle(req: Request, res: Response) {
    const table_id = req.query.table_id as string

    const listOrders = new ListOrdersService()

    try {
      const orders = await listOrders.execute({ table_id })
      return res.status(StatusCodes.OK).json(orders)
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

export { ListOrdersController }
