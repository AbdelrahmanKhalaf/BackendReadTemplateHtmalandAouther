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
exports.validatHistory = exports.History = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const mongodb_1 = require("mongodb");
const schema = new mongoose_1.Schema({
    prodact: {
        type: {
            name: {
                type: String,
                require: true
            },
            idProdact: {
                type: String,
                require: true
            },
            delete: {
                type: Boolean,
                default: false,
                require: true
            }
        }
    },
    prodactId: {
        type: String,
        required: true
    },
    outDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    userId: {
        type: mongodb_1.ObjectId, ref: "users", require: true
    },
    status: {
        type: String,
        required: true
    },
});
exports.History = mongoose_1.default.model("history", schema);
function validatHistory(history) {
    const schema = {
        userId: joi_1.default.string().required(),
        prodactId: joi_1.default.string().required(),
        status: joi_1.default.string().required(),
    };
    return joi_1.default.validate(history, schema);
}
exports.validatHistory = validatHistory;
//# sourceMappingURL=historyOrder.model.js.map