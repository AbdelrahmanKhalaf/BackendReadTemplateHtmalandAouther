"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthuthrationMiddleware = void 0;
const errorResponse_1 = require("../errors/errorResponse");
const jwt = require("jsonwebtoken");
const config = require("config");
const AuthuthrationMiddleware = async function (req, res, next) {
    try {
        if (res.locals.user && !res.locals.user.isAdmin)
            return new errorResponse_1.ErorrResponse("Accsess denied", 401);
        next();
    }
    catch (err) {
        next(new errorResponse_1.ErorrResponse(err, 400));
    }
    return;
};
exports.AuthuthrationMiddleware = AuthuthrationMiddleware;
//# sourceMappingURL=admin.js.map