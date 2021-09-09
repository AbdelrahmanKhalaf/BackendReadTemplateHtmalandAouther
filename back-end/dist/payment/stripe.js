"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeAPI = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.stripeAPI = require("stripe")(config_1.default.secreteKeyStripe);
//# sourceMappingURL=stripe.js.map