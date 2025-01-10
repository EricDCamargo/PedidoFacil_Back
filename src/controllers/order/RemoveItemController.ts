import { Request, Response } from 'express'
import { RemoveItemService } from '../../services/order/RemoveItemService'

class RemoveItemController {
  async handle(req: Request, res: Response) {
    const item_id = req.query.item_id as string

    const removeItem = new RemoveItemService()

    try {
      const result = await removeItem.execute({
        item_id
      })

      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { RemoveItemController }