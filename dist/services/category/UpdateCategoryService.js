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
exports.UpdateCategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateCategoryService {
    execute({ id, name }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !name) {
                throw new AppError_1.AppError('É necessario informar um ID e um nome!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const category = yield prisma_1.default.category.findUnique({
                where: { id }
            });
            if (!category) {
                throw new AppError_1.AppError('Categoria não encontrada!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const existingCategory = yield prisma_1.default.category.findFirst({
                where: {
                    name,
                    NOT: { id }
                }
            });
            if (existingCategory) {
                throw new AppError_1.AppError('Já existe uma categoria com esse nome!', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const updatedCategory = yield prisma_1.default.category.update({
                where: { id },
                data: { name, updated_at: new Date() },
                select: {
                    id: true,
                    name: true
                }
            });
            return {
                data: updatedCategory,
                message: 'Categoria atualizada com sucesso!'
            };
        });
    }
}
exports.UpdateCategoryService = UpdateCategoryService;
