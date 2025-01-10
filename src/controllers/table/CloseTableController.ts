import { Request, Response } from 'express'
import { CloseTableService } from '../../services/table/CloseTableService'

class CloseTableController {
  async handle(req: Request, res: Response) {
    const { table_id, payment_method } = req.body

    const closeTableService = new CloseTableService()

    try {
      const result = await closeTableService.execute({ table_id, payment_method })
      return res.json(result)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { CloseTableController }