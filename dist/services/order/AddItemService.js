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
exports.AddItemService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
const socket_1 = require("../../@types/socket");
const socket_2 = require("../../utils/socket");
class AddItemService {
    execute({ order_id, product_id, amount, observation }) {
        return __awaiter(this, void 0, void 0, function* () {
            //retrive product information in order to verify if product exists
            const product = yield prisma_1.default.product.findUnique({
                where: { id: product_id }
            });
            //verify if product exists
            if (!product) {
                throw new AppError_1.AppError('Produto não encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            if (amount <= 0) {
                throw new AppError_1.AppError('A quantidade de produto deve ser maior que zero.', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            //retrieve order information in order to verify if order exists
            const order = yield prisma_1.default.order.findUnique({
                where: { id: order_id },
                include: { items: true }
            });
            //verify if order exists
            if (!order) {
                throw new AppError_1.AppError('Pedido não encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const total_value = amount * product.price;
            const item = yield prisma_1.default.item.create({
                data: {
                    order_id,
                    product_id,
                    amount,
                    unit_value: product.price,
                    total_value,
                    observation
                }
            });
            const total = order.items.reduce((sum, item) => sum + item.total_value, 0) + total_value;
            yield prisma_1.default.order.update({
                where: { id: order_id },
                data: { total }
            });
            (0, socket_2.emitSocketEvent)(socket_1.SocketEvents.ORDER_CHANGED, { table_id: order.table_id });
            return { data: item, message: 'Item adicionado ao pedido!' };
        });
    }
}
exports.AddItemService = AddItemService;
