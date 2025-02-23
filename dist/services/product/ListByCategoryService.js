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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListByCategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class ListByCategoryService {
    execute({ category_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!category_id) {
                throw new AppError_1.AppError('Necessario informar ID da categoria!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const findByCategory = yield prisma_1.default.product.findMany({
                where: {
                    category_id: category_id
                }
            });
            if (!findByCategory) {
                throw new AppError_1.AppError('Nenhum produto encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return { data: findByCategory, message: 'Lista de protutos por categoria!' };
        });
    }
}
exports.ListByCategoryService = ListByCategoryService;
