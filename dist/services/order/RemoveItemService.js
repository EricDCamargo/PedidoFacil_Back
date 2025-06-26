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
exports.RemoveItemService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
const socket_1 = require("../../@types/socket");
const server_1 = require("../../server");
class RemoveItemService {
    execute({ item_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield prisma_1.default.item.findUnique({
                where: { id: item_id },
                include: { order: true, product: true }
            });
            if (!item) {
                throw new AppError_1.AppError('Item não encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const order = yield prisma_1.default.order.findUnique({
                where: { id: item.order_id },
                include: { items: { include: { product: true } } }
            });
            if (!order) {
                throw new AppError_1.AppError('Pedido não encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            yield prisma_1.default.item.delete({
                where: { id: item_id }
            });
            const total = order.items.reduce((sum, item) => sum + item.total_value, 0) -
                item.total_value;
            yield prisma_1.default.order.update({
                where: { id: order.id },
                data: { total }
            });
            yield server_1.io.emit(socket_1.SocketEvents.ORDER_CHANGED, { table_id: order.table_id });
            return { message: 'Item removido com sucesso' };
        });
    }
}
exports.RemoveItemService = RemoveItemService;
