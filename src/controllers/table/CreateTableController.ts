import { Request, Response } from 'express'
import { CreateTableService } from '../../services/table/CreateTableService'

class CreateTableController {
  async handle(req: Request, res: Response) {
    const { number } = req.body

    const createTableService = new CreateTableService()

    try {
      const table = await createTableService.execute({ number })
      return res.json(table)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { CreateTableController }