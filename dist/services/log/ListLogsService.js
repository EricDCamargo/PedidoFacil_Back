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
exports.ListLogsService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListLogsService {
    execute({ user_id, startDate, endDate }) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (user_id) {
                where.user_id = user_id;
            }
            if (startDate || endDate) {
                where.created_at = {};
                if (startDate) {
                    where.created_at.gte = startDate;
                }
                if (endDate) {
                    where.created_at.lte = endDate;
                }
            }
            const logs = yield prisma_1.default.log.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
            return { data: logs, message: 'List of logs' };
        });
    }
}
exports.ListLogsService = ListLogsService;
