"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErorrResponse = void 0;
class ErorrResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        statusCode = this.statusCode;
    }
}
exports.ErorrResponse = ErorrResponse;
//# sourceMappingURL=errorResponse.js.map