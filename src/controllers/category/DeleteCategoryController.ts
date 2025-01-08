import { Request, Response } from 'express'
import { DeleteCategoryService } from '../../services/category/DeleteCategoryService'

class DeleteCategoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query.category_id as string

    if (!category_id) {
      return res.status(400).json({ error: 'Category ID is required' })
    }

    const deleteCategoryService = new DeleteCategoryService()

    try {
      const result = await deleteCategoryService.execute({ category_id })
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}

export { DeleteCategoryController }
