"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatInventary = exports.Inventary = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const schema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "orders",
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    prodactId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "prodacts",
        required: true,
    },
    titleProdact: {
        type: String
    },
    idToView: {
        type: String
    },
    count: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});
exports.Inventary = mongoose_1.default.model("inventary", schema);
function validatInventary(user) {
    const schema = {
        orderId: joi_1.default.string().required(),
        prodactId: joi_1.default.string().required(),
        userId: joi_1.default.string().required(),
        count: joi_1.default.number().required(),
        status: joi_1.default.number().required(),
    };
    return joi_1.default.validate(user, schema);
}
exports.validatInventary = validatInventary;
//# sourceMappingURL=inventary.model.js.map