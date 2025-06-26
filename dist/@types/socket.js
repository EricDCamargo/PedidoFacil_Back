"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvents = void 0;
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["ORDER_CHANGED"] = "orderChanged";
    SocketEvents["TABLE_STATUS_CHANGED"] = "tableStatusChanged";
    SocketEvents["PAYMENT_REGISTERED"] = "paymentRegistered";
    SocketEvents["ORDER_SENT_TO_KITCHEN"] = "orderSentToKitchen";
    SocketEvents["PRODUCT_UPDATED"] = "productUpdated";
    SocketEvents["CATEGORY_UPDATED"] = "categoryUpdated";
    SocketEvents["LOG_CREATED"] = "logCreated"; // Emitido quando um log é criado
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
