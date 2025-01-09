import { Request, Response } from 'express'
import { RemoveCategoryService } from '../../services/category/RemoveCategoryService'

class RemoveCategoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query.category_id as string

    if (!category_id) {
      return res.status(400).json({ error: 'Category ID is required' })
    }

    const removeCategoryService = new RemoveCategoryService()

    try {
      const result = await removeCategoryService.execute({ category_id })
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}

export { RemoveCategoryController }
