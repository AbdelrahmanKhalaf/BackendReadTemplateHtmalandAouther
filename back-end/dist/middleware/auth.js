"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = void 0;
const user_model_1 = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config_1 = __importDefault(require("../config/config"));
const AuthenticationMiddleware = async function (req, res, next) {
    try {
        const token = req.header("Authentication");
        if (!token)
            return res.status(500).send({ error_ar: "الوصول مرفوض ، لم يتم توفير رمز مميز", error_en: "denied" });
        const decoded = jwt.verify(token, config_1.default.JTWSecretPivate);
        const user = await user_model_1.User.find({ email: decoded.email });
        if (!user)
            return res.status(500).send(`Invalid Token with Id of ${decoded._id}`);
        res.locals.user = user[0];
        return next();
    }
    catch (ex) {
        next(ex);
    }
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
//# sourceMappingURL=auth.js.map