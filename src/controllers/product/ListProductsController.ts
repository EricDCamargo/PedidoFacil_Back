import { Request, Response } from 'express'
import { ListProductsService } from '../../services/product/ListProductsService '

class ListProductsController {
  async handle(req: Request, res: Response) {
    const listProductsService = new ListProductsService()

    try {
      const products = await listProductsService.execute()
      return res.json(products)
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }
}

export { ListProductsController }
