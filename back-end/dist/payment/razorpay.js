"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.RazorypayConfig = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
exports.RazorypayConfig = {
    key_id: '',
    key_secret: ''
};
exports.instance = new razorpay_1.default(exports.RazorypayConfig);
//# sourceMappingURL=razorpay.js.map