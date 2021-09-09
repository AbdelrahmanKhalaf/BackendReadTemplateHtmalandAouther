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
exports.validatCategory = exports.Category = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const schema = new mongoose_1.Schema({
    title_ar: {
        type: String,
        minlength: 1,
        maxlength: 30,
        required: true,
    }, title_en: {
        type: String,
        minlength: 1,
        maxlength: 30,
        required: true,
    },
});
exports.Category = mongoose_1.default.model("category", schema);
function validatCategory(user) {
    const schema = {
        title_ar: joi_1.default.string().min(1).max(250),
        title_en: joi_1.default.string().min(1).max(250),
    };
    return joi_1.default.validate(user, schema);
}
exports.validatCategory = validatCategory;
//# sourceMappingURL=categories.model.js.map