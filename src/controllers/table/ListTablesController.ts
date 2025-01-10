import { Request, Response } from 'express'
import { ListTablesService } from '../../services/table/ListTablesService'

class ListTablesController {
  async handle(req: Request, res: Response) {
    const listTablesService = new ListTablesService()

    try {
      const tables = await listTablesService.execute()
      return res.json(tables)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { ListTablesController }