import { Request, Response } from 'express'
import { UpdateProductService } from '../../services/product/UpdateProductService'

class UpdateProductController {
  async handle(req: Request, res: Response) {
    const product_id = req.query.product_id as string
    const { name, price, description, banner, category_id } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    const updateProductService = new UpdateProductService()

    try {
      const banner = req.file ? req.file.filename : undefined

      const updatedProduct = await updateProductService.execute({
        product_id,
        name,
        price,
        description,
        banner,
        category_id
      })

      return res.json(updatedProduct)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}

export { UpdateProductController }
