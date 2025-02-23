"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.TableStatus = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "DRAFT";
    OrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["CLOSED"] = "CLOSED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var TableStatus;
(function (TableStatus) {
    TableStatus["AVAILABLE"] = "AVAILABLE";
    TableStatus["OCCUPIED"] = "OCCUPIED";
    TableStatus["RESERVED"] = "RESERVED";
})(TableStatus || (exports.TableStatus = TableStatus = {}));
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
})(Role || (exports.Role = Role = {}));
