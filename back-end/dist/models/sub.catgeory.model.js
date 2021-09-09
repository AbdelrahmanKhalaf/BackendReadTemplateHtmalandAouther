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
exports.validatesubOfCategoryUpdate = exports.validatesubOfCategory = exports.subOfCategory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const schema = new mongoose_1.Schema({
    title_ar: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    title_en: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    IdCategory: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "category", require: true },
    img: {
        type: String,
        default: "uploads/event.png",
    }
});
exports.subOfCategory = mongoose_1.default.model("subofcategories", schema);
function validatesubOfCategory(user) {
    const schema = {
        title_ar: joi_1.default.string().min(2).max(30),
        title_en: joi_1.default.string().min(2).max(30),
        IdCategory: joi_1.default.any().required()
    };
    return joi_1.default.validate(user, schema);
}
exports.validatesubOfCategory = validatesubOfCategory;
function validatesubOfCategoryUpdate(user) {
    const schema = {
        title_ar: joi_1.default.string().min(2).max(30),
        title_en: joi_1.default.string().min(2).max(30),
    };
    return joi_1.default.validate(user, schema);
}
exports.validatesubOfCategoryUpdate = validatesubOfCategoryUpdate;
//# sourceMappingURL=sub.catgeory.model.js.map