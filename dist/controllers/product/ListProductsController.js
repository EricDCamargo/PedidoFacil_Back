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
exports.ListProductsController = void 0;
const ListProductsService_1 = require("../../services/product/ListProductsService ");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
class ListProductsController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const listProductsService = new ListProductsService_1.ListProductsService();
            try {
                const products = yield listProductsService.execute();
                return res.status(http_status_codes_1.StatusCodes.OK).json(products);
            }
            catch (error) {
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
exports.ListProductsController = ListProductsController;
