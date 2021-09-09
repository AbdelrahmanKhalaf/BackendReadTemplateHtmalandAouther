"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorResponse_1 = require("./errorResponse");
const errorHandler = (err, req, res, next) => {
    console.log(err);
    let error;
    if (err.name == 'CastError') {
        const message = `the prodact not found with id of ${err.value}`;
        error = new errorResponse_1.ErorrResponse(message, 404);
    }
    if (err.code === 1100) {
        const message = 'Dublicate field value entered ';
        error = new errorResponse_1.ErorrResponse(message, 400);
    }
    if (err.name == "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new errorResponse_1.ErorrResponse(message, 500);
    }
    res.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'SERVER ERROR'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map