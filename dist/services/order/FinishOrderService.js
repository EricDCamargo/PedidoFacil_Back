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
exports.FinishOrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const types_1 = require("../../@types/types");
const prisma_1 = __importDefault(require("../../prisma"));
class FinishOrderService {
    execute({ order_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { IN_PROGRESS, COMPLETED } = types_1.OrderStatus;
            const order = yield prisma_1.default.order.findUnique({
                where: { id: order_id }
            });
            if (!order) {
                throw new AppError_1.AppError('Pedido não encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (order.status !== IN_PROGRESS) {
                throw new AppError_1.AppError('O pedido não está EM PROGRESSO.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const updatedOrder = yield prisma_1.default.order.update({
                where: { id: order_id },
                data: { status: COMPLETED, updated_at: new Date() }
            });
            return { data: updatedOrder, message: 'Pedido finalizado com sucesso!' };
        });
    }
}
exports.FinishOrderService = FinishOrderService;
