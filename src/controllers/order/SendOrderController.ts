import { Request, Response } from 'express'
import { SendOrderService } from '../../services/order/SendOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class SendOrderController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.body

    const sendOrder = new SendOrderService()

    try {
      const order = await sendOrder.execute({
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

export { SendOrderController }
