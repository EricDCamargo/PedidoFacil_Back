import { Request, Response } from 'express'
import { UpdateProductService } from '../../services/product/UpdateProductService'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../../errors/AppError'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { UploadedFile } from 'express-fileupload'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

class UpdateProductController {
  async handle(request: Request, response: Response) {
    const product_id = request.query.product_id as string
    const { name, price, description, category_id } = request.body

    const updateProductService = new UpdateProductService()
    let banner: string | undefined

    if (
      request.files ||
      (request.files && Object.keys(request.files).length > 0)
    ) {
      const file: UploadedFile = request.files['file'] as UploadedFile

      const resultFile: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({}, function (error, result) {
              if (error) {
                reject(error)
                return
              }
              resolve(result)
            })
            .end(file.data)
        }
      )
      banner = resultFile.url
    }

    try {
      const updatedProduct = await updateProductService.execute({
        product_id,
        name,
        price: parseFloat(price),
        description,
        banner: banner,
        category_id
      })

      return response.status(StatusCodes.OK).json(updatedProduct)
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({ error: error.message })
      }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' })
    }
  }
}

export { UpdateProductController }
