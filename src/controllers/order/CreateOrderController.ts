import { Request, Response } from 'express'
import { CreateOrderService } from '../../services/order/CreateOrderService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { table_id, name } = req.body

    const createOrderService = new CreateOrderService()

    try {
      const order = await createOrderService.execute({ table_id, name })
      return res.status(StatusCodes.CREATED).json(order)
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

export { CreateOrderController }
