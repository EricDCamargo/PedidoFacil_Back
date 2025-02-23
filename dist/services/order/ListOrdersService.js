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
exports.ListOrdersService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const types_1 = require("../../@types/types");
class ListOrdersService {
    execute({ table_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { DRAFT, IN_PROGRESS, COMPLETED, PAID, CLOSED } = types_1.OrderStatus;
            const filter = {
                status: {
                    in: [DRAFT, IN_PROGRESS, COMPLETED, PAID, ...(table_id ? [] : [CLOSED])]
                }
            };
            if (table_id) {
                filter.table_id = table_id;
            }
            const orders = yield prisma_1.default.order.findMany({
                where: filter,
                orderBy: {
                    created_at: 'desc'
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    description: true,
                                    banner: true,
                                    category: true
                                }
                            }
                        }
                    },
                    paymentOrders: {
                        include: {
                            payment: true
                        }
                    }
                }
            });
            return { data: orders, message: 'Lista de pedidos por mesa' };
        });
    }
}
exports.ListOrdersService = ListOrdersService;
