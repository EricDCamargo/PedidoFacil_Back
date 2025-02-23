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
exports.UpdateUserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateUserService {
    execute({ user_id, name, email, role }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findFirst({
                where: { id: user_id }
            });
            if (!email) {
                throw new AppError_1.AppError('Informar um email e nome validos!', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (!user) {
                throw new AppError_1.AppError('Usuario não encontrado!', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            const userAlreadyExists = yield prisma_1.default.user.findUnique({
                where: { email }
            });
            if (userAlreadyExists) {
                throw new AppError_1.AppError('Email já cadastrado em outro usuario!', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const updatedUser = yield prisma_1.default.user.update({
                where: { id: user_id },
                data: {
                    name,
                    email,
                    role,
                    updated_at: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });
            return { data: updatedUser, message: 'Usuario editado com sucesso!' };
        });
    }
}
exports.UpdateUserService = UpdateUserService;
