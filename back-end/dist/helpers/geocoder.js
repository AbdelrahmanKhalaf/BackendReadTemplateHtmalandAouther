"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocoder = void 0;
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const config_1 = __importDefault(require("../config/config"));
const options = {
    provider: config_1.default.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: config_1.default.GEOCODER_API_KEY,
    formatter: null
};
exports.geocoder = node_geocoder_1.default(options);
//# sourceMappingURL=geocoder.js.map