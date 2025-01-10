import { Request, Response } from 'express'
import { GetTableDetailsService } from '../../services/table/GetTableDetailsService'

class GetTableDetailsController {
  async handle(req: Request, res: Response) {
    const { table_id } = req.query

    const getTableDetailsService = new GetTableDetailsService()

    try {
      const table = await getTableDetailsService.execute({ table_id: table_id as string })
      return res.json(table)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { GetTableDetailsController }