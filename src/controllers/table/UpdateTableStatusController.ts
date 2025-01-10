import { Request, Response } from 'express'
import { UpdateTableStatusService } from '../../services/table/UpdateTableStatusService'

class UpdateTableStatusController {
  async handle(req: Request, res: Response) {
    const { table_id, status } = req.body

    const updateTableStatusService = new UpdateTableStatusService()

    try {
      const table = await updateTableStatusService.execute({ table_id, status })
      return res.json(table)
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export { UpdateTableStatusController }