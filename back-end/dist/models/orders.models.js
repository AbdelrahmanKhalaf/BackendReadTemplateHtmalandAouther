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
exports.validatOrder = exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const schema = new mongoose_1.Schema({
    address_ar: {
        type: String,
        default: ""
    },
    address_en: {
        type: String,
        default: ""
    },
    count: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: "users", require: true
    },
    prodactId: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: "prodacts", require: true
    },
    status: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    },
    prodactDetails: {
        type: {
            prodactId: {
                type: String
            },
            sale: {
                type: Number
            },
            price: {
                type: Number
            },
            title_en: {
                type: String
            },
            img: {
                type: String
            }
        }
    }
});
exports.Order = mongoose_1.default.model("orders", schema);
function validatOrder(user) {
    const schema = {
        address_ar: joi_1.default.string(),
        address_en: joi_1.default.string(),
        price: joi_1.default.number(),
        count: joi_1.default.number().required(),
        userId: joi_1.default.string().required(),
        prodactId: joi_1.default.string().required(),
        status: joi_1.default.number()
    };
    return joi_1.default.validate(user, schema);
}
exports.validatOrder = validatOrder;
//# sourceMappingURL=orders.models.js.map