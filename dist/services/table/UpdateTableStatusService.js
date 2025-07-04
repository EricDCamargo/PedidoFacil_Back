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
exports.UpdateTableStatusService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
const socket_1 = require("../../@types/socket");
const socket_2 = require("../../utils/socket");
class UpdateTableStatusService {
    execute({ table_id, status }) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield prisma_1.default.table.findUnique({
                where: { id: table_id }
            });
            if (!table) {
                throw new AppError_1.AppError('Mesa não encontrada.', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const updatedTable = yield prisma_1.default.table.update({
                where: { id: table_id },
                data: { status, updated_at: new Date() }
            });
            (0, socket_2.emitSocketEvent)(socket_1.SocketEvents.TABLE_STATUS_CHANGED);
            return { data: updatedTable, message: 'Mesa editada com sucesso!' };
        });
    }
}
exports.UpdateTableStatusService = UpdateTableStatusService;
