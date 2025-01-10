import { Response, Request } from 'express'
import { ListOrdersService } from '../../services/order/ListOrdersService'

class ListOrdersController {
  async handle(req: Request, res: Response) {
    const table_id = req.query.table_id as string

    const listOrders = new ListOrdersService()

    try {
      const orders = await listOrders.execute({ table_id })
      return res.json(orders)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { ListOrdersController }
