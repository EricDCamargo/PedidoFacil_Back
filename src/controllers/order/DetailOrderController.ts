import { Request, Response } from 'express'
import { DetailOrderService } from '../../services/order/DetailOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class DetailOrderController {
  async handle(req: Request, res: Response) {
    const order_id = req.query.order_id as string

    const detailOrder = new DetailOrderService()

    try {
      const order = await detailOrder.execute({
        order_id
      })

      return res.status(StatusCodes.OK).json(order)
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

export { DetailOrderController }
