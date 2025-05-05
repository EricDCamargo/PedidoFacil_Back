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
exports.SendOrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const types_1 = require("../../@types/types");
const prisma_1 = __importDefault(require("../../prisma"));
class SendOrderService {
    execute({ order_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { DRAFT, IN_PROGRESS } = types_1.OrderStatus;
            const order = yield prisma_1.default.order.findUnique({
                where: { id: order_id },
                include: { items: true }
            });
            if (!order) {
                throw new AppError_1.AppError('Pedido não encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (order.status !== DRAFT) {
                throw new AppError_1.AppError('Pedido já encaminhado para a cozinha.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (order.total <= 0) {
                throw new AppError_1.AppError('Não é possível encaminhar um pedido com total zero.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (order.items.length === 0) {
                throw new AppError_1.AppError('Não é possível encaminhar um pedido sem itens.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // Atualizar o status do pedido
            yield prisma_1.default.order.update({
                where: { id: order_id },
                data: { status: IN_PROGRESS, updated_at: new Date() },
            });
            // Buscar o pedido atualizado com os relacionamentos necessários
            const updatedOrder = yield prisma_1.default.order.findUnique({
                where: { id: order_id },
                include: { items: { include: { product: true } } },
            });
            return { data: updatedOrder, message: 'Pedido enviado para a cozinha!' };
        });
    }
}
exports.SendOrderService = SendOrderService;
