import { Response, Request } from 'express'
import { CreateProductService } from '../../services/product/CreateProductService'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { UploadedFile } from 'express-fileupload'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

class CreateProductController {
  async handle(request: Request, response: Response) {
    const { name, price, description, category_id } = request.body

    const createProductService = new CreateProductService()

    if (!request.files || Object.keys(request.files).length === 0) {
      throw new Error('Erro ao fazer o uoload da imagem!')
    } else {
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

      try {
        const product = await createProductService.execute({
          name,
          price,
          description,
          banner: resultFile.url,
          category_id
        })

        return response.status(StatusCodes.CREATED).json(product)
      } catch (error) {
        if (error instanceof AppError) {
          return response
            .status(error.statusCode)
            .json({ error: error.message })
        }
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' })
      }
    }
  }
}

export { CreateProductController }
