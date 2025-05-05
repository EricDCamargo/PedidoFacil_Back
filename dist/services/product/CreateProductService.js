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
exports.CreateProductService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class CreateProductService {
    execute({ name, price, description, banner, category_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name || !price || !description || !banner || !category_id) {
                throw new AppError_1.AppError('Todos os campos são obrigatórios!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (typeof price !== 'number') {
                throw new AppError_1.AppError('Price must be provided as a number', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Verificar se já existe um produto com o mesmo nome
            const existingProduct = yield prisma_1.default.product.findUnique({
                where: { name }
            });
            if (existingProduct) {
                throw new AppError_1.AppError('Já existe um produto com esse nome!', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const product = yield prisma_1.default.product.create({
                data: {
                    name,
                    price,
                    description,
                    banner,
                    category_id
                }
            });
            return { data: product, message: 'Produto cadastrado com sucesso!' };
        });
    }
}
exports.CreateProductService = CreateProductService;
