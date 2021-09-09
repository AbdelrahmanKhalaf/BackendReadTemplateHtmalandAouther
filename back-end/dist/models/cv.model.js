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
exports.validCv = exports.CV = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
process.env.SUPPRESS_NO_CONFIG_WARNING = "../models/user.model.ts";
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: [30, "Name can not be more than 30 charcters"],
        required: [true, 'please add a name'],
        trim: true
    },
    dec: {
        type: String,
        required: [true, 'please add a name'],
    },
    path: {
        type: String,
        required: [true, 'please add a file'],
    },
    avatar: {
        type: String,
        default: "uploads/avatar_1587657175473.png",
        required: true,
    },
});
exports.CV = mongoose_1.default.model("cv", schema);
function validCv(user) {
    const schema = {
        name: joi_1.default.string().min(8).max(30).required(),
        dec: joi_1.default.string().min(11).required(),
    };
    return joi_1.default.validate(user, schema);
}
exports.validCv = validCv;
//# sourceMappingURL=cv.model.js.map