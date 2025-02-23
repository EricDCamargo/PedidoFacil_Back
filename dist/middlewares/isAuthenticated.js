"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const types_1 = require("../@types/types");
const http_status_codes_1 = require("http-status-codes");
function isAuthenticated(req, res, next) {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: 'Token não encontrado!' })
            .end();
    }
    const [, token] = authToken.split(' ');
    try {
        const { sub, role } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        req.user_id = sub;
        req.user_role = role;
        return next();
    }
    catch (err) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: 'Token invalido ou expirado!' })
            .end();
    }
} // Verify access level
exports.isAuthenticated = isAuthenticated;
function isAdmin(req, res, next) {
    if (req.user_role !== types_1.Role.ADMIN) {
        return res.status(403).json({ error: 'Permisão negada!' });
    }
    return next();
}
exports.isAdmin = isAdmin;
