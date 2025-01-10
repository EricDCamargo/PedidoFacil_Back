import { Request, Response } from 'express'
import { AddItemService } from '../../services/order/AddItemService'

class AddItemController {
  async handle(req: Request, res: Response) {
    const { order_id, product_id, amount } = req.body

    const addItem = new AddItemService()

    try {
      const item = await addItem.execute({
        order_id,
        product_id,
        amount
      })

      return res.json(item)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { AddItemController }
