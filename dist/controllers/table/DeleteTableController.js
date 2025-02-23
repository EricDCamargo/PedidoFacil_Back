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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTableController = void 0;
const DeleteTableService_1 = require("../../services/table/DeleteTableService");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../errors/AppError");
class DeleteTableController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const table_id = req.query.table_id;
            const deleteTableService = new DeleteTableService_1.DeleteTableService();
            try {
                const result = yield deleteTableService.execute({ table_id });
                return res.status(http_status_codes_1.StatusCodes.OK).json(result);
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.DeleteTableController = DeleteTableController;
