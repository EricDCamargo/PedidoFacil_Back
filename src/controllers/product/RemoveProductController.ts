import { Request, Response } from 'express'
import { RemoveProductService } from '../../services/product/RemoveProductService'

class RemoveProductController {
  async handle(req: Request, res: Response) {
    const product_id = req.query.product_id as string

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    const removeProductService = new RemoveProductService()

    try {
      const result = await removeProductService.execute(product_id)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}

export { RemoveProductController }
