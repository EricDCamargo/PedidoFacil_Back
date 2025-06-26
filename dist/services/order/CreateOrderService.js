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
exports.CreateOrderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const types_1 = require("../../@types/types");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
const socket_1 = require("../../@types/socket");
const server_1 = require("../../server");
class CreateOrderService {
    execute({ table_id, name }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { DRAFT, IN_PROGRESS } = types_1.OrderStatus;
            const { OCCUPIED } = types_1.TableStatus;
            const table = yield prisma_1.default.table.findUnique({
                where: { id: table_id }
            });
            if (!table) {
                throw new AppError_1.AppError('Mesa não encontrada.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const existingOrders = yield prisma_1.default.order.findMany({
                where: {
                    table_id,
                    status: {
                        in: [DRAFT, IN_PROGRESS]
                    }
                }
            });
            if (existingOrders.length === 0) {
                yield prisma_1.default.table
                    .update({
                    where: { id: table_id },
                    data: { status: OCCUPIED }
                })
                    .then(() => server_1.io.emit(socket_1.SocketEvents.TABLE_STATUS_CHANGED));
            }
            const order = yield prisma_1.default.order.create({
                data: {
                    table: { connect: { id: table_id } },
                    name,
                    status: DRAFT
                }
            });
            yield server_1.io.emit(socket_1.SocketEvents.ORDER_CHANGED, { table_id });
            return { data: order, message: 'Pedido criado!' };
        });
    }
}
exports.CreateOrderService = CreateOrderService;
