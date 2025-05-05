import { Request, Response } from 'express'
import { AddItemService } from '../../services/order/AddItemService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'

class AddItemController {
  async handle(req: Request, res: Response) {
    const { order_id, product_id, amount, observation } = req.body

    const addItem = new AddItemService()

    try {
      const item = await addItem.execute({
        order_id,
        product_id,
        amount,
        observation
      })

      return res.status(StatusCodes.CREATED).json(item)
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

export { AddItemController }
