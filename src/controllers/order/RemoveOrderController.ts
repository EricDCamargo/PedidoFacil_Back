import { Request, Response } from 'express'
import { RemoveOrderService } from '../../services/order/RemoveOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class RemoveOrderController {
  async handle(req: Request, res: Response) {
    const order_id = req.query.order_id as string

    const removeOrder = new RemoveOrderService()

    try {
      const order = await removeOrder.execute({
        order_id
      })

      return res.status(StatusCodes.OK).json(order)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      console.log(error)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }
}

export { RemoveOrderController }
