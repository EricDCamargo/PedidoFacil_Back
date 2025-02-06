import { Response, Request } from 'express'
import { FinishOrderService } from '../../services/order/FinishOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class FinishOrderController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.body

    const finishOrderService = new FinishOrderService()

    try {
      const order = await finishOrderService.execute({
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

export { FinishOrderController }
