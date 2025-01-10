import { Request, Response } from 'express'
import { DetailOrderService } from '../../services/order/DetailOrderService'

class DetailOrderController {
  async handle(req: Request, res: Response) {
    const order_id = req.query.order_id as string

    const detailOrder = new DetailOrderService()

    try {
      const order = await detailOrder.execute({
        order_id
      })

      return res.json(order)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { DetailOrderController }
