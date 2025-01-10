import { Response, Request } from 'express'
import { CreateProductService } from '../../services/product/CreateProductService'

class CreateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, category_id } = req.body

    const createProductService = new CreateProductService()

    if (!req.file) {
      throw new Error('error uploading product file')
    } else {
      const { filename: banner } = req.file

      try {
        const product = await createProductService.execute({
          name,
          price: parseFloat(price), 
          description,
          banner,
          category_id
        })

        return res.json(product)
      } catch (error: any) {
        return res.status(400).json({ error: error.message })
      }
    }
  }
}

export { CreateProductController }
