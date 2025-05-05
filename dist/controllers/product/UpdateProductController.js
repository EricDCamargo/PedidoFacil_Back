"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductController = void 0;
const UpdateProductService_1 = require("../../services/product/UpdateProductService");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
class UpdateProductController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = request.query.product_id;
            const { name, price, description, category_id } = request.body;
            const updateProductService = new UpdateProductService_1.UpdateProductService();
            let banner;
            if (request.files ||
                (request.files && Object.keys(request.files).length > 0)) {
                const file = request.files['file'];
                const resultFile = yield new Promise((resolve, reject) => {
                    cloudinary_1.v2.uploader
                        .upload_stream({}, function (error, result) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(result);
                    })
                        .end(file.data);
                });
                banner = resultFile.url;
            }
            try {
                const updatedProduct = yield updateProductService.execute({
                    product_id,
                    name,
                    price: parseFloat(price),
                    description,
                    banner: banner,
                    category_id
                });
                return response.status(http_status_codes_1.StatusCodes.OK).json(updatedProduct);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return response.status(error.statusCode).json({ error: error.message });
                }
                return response
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.UpdateProductController = UpdateProductController;
