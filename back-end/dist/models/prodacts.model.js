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
exports.validatecategory = exports.validateProdactUpda = exports.validateProdact = exports.Prodact = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const schema = new mongoose_1.Schema({
    attributes: {
        type: [
            {
                key_ar: { type: String, require: true },
                key_en: { type: String, require: true },
                value_ar: { type: String, require: true },
                value_en: { type: String, require: true },
            },
        ],
    },
    price: {
        type: Number,
    },
    sale: {
        type: Number,
        max: [100, "pless max sale is 100"],
        min: 0,
    },
    endsale: {
        type: Date,
    },
    kindOfCategory: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "subofcategories",
            require: [true, "pleass add subofcategories"],
        },
    ],
    img: {
        type: [
            {
                img: {
                    type: String
                }
            }
        ],
        default: {
            img: 'uploads/event1.jpg'
        },
    },
    dateOut: {
        type: Date,
        default: Date.now(),
    },
    des_ar: {
        type: String,
        required: true,
        maxlength: 500,
    },
    des_en: {
        type: String,
        required: true,
        maxlength: 500,
    },
    keywords: {
        type: String,
        required: true,
        maxlength: 500,
    },
    title_ar: {
        type: String,
        required: true,
        maxlength: 100,
    },
    title_en: {
        type: String,
        required: [true, "pleas add title "],
        maxlength: 100,
    },
});
exports.Prodact = mongoose_1.default.model("prodacts", schema);
function validateProdact(prodact) {
    const schema = {
        attributes: joi_1.default.array().required(),
        price: joi_1.default.number(),
        category: joi_1.default.string().min(1).max(250),
        sale: joi_1.default.number().required(),
        img: joi_1.default.string().min(1).max(250),
        kindOfCategory: joi_1.default.array().required(),
        des_ar: joi_1.default.string().max(500).required(),
        des_en: joi_1.default.string().max(500).required(),
        keywords: joi_1.default.string().max(500).required(),
        title_ar: joi_1.default.string().max(100).required(),
        title_en: joi_1.default.string().max(100).required(),
        endsale: joi_1.default.date(),
    };
    return joi_1.default.validate(prodact, schema);
}
exports.validateProdact = validateProdact;
function validateProdactUpda(user) {
    const schema = {
        key_ar: joi_1.default.string().min(1).max(250).required(),
        key_an: joi_1.default.string().min(1).max(250).required(),
        value_ar: joi_1.default.string().min(1).max(250).required(),
        value_en: joi_1.default.string().min(1).max(250).required(),
    };
    return joi_1.default.validate(user, schema);
}
exports.validateProdactUpda = validateProdactUpda;
function validatecategory(user) {
    const schema = {
        kindOfCategory: joi_1.default.array().required(),
    };
    return joi_1.default.validate(user, schema);
}
exports.validatecategory = validatecategory;
//# sourceMappingURL=prodacts.model.js.map