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
exports.RemoveProductController = void 0;
const RemoveProductService_1 = require("../../services/product/RemoveProductService");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
class RemoveProductController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const product_id = req.query.product_id;
            const removeProductService = new RemoveProductService_1.RemoveProductService();
            try {
                console.log(product_id);
                const result = yield removeProductService.execute(product_id);
                return res.status(http_status_codes_1.StatusCodes.OK).json(result);
            }
            catch (error) {
                console.log(error);
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.RemoveProductController = RemoveProductController;
