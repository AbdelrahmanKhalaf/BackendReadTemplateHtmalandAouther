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
exports.validateUserEmail = exports.vaildavatar = exports.validateUserPassword = exports.validateAddInformtionUser = exports.validateUserUpdate = exports.validateUser = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
process.env.SUPPRESS_NO_CONFIG_WARNING = "../models/user.model.ts";
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: [30, "Name can not be more than 30 charcters"],
        required: [true, 'please add a name'],
        trim: true
    },
    age: {
        type: String,
    },
    gender: {
        type: Number,
    },
    email: {
        type: String,
        maxlength: 315,
        required: true,
    },
    phone: {
        type: Number,
        minlength: 8,
        maxlength: 100,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    avatar: {
        type: String,
        default: "uploads/avatar_1587657175473.png",
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 2015,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    address: {
        type: String,
        minlength: 10,
        maxlength: 360,
        required: [true, 'pleas add address']
    },
    resetLink: {
        type: String,
        default: "",
    },
    verify: {
        type: Boolean,
        default: false,
    },
    confirmPassword: {
        type: String,
        required: true
    },
    blocked: {
        type: Boolean,
        default: false
    },
    walt: {
        type: Number,
        default: 0
    },
    location: {
        type: {
            type: String,
            default: "point"
        },
        coordinates: {
            type: [Number],
            require: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    }
});
schema.methods.generaToken = function () {
    const token = jsonwebtoken_1.default.sign({
        _id: this._id,
        email: this.email,
    }, config_1.default.JTWSecretPivate);
    return token;
};
exports.User = mongoose_1.default.model("users", schema);
function validateUser(user) {
    const schema = {
        name: joi_1.default.string().min(8).max(30).required(),
        email: joi_1.default.string().email().min(8).max(100).required(),
        phone: joi_1.default.number().min(11).required(),
        password: joi_1.default.string().min(8).max(28).required(),
        confirmPassword: joi_1.default.string().min(8).max(100).required(),
        address: joi_1.default.string().min(10).max(500).required(),
    };
    return joi_1.default.validate(user, schema);
}
exports.validateUser = validateUser;
function validateUserUpdate(userUpdate) {
    const schema = {
        name: joi_1.default.string().min(8).max(315),
        phone: joi_1.default.any(),
        age: joi_1.default.number(),
        gender: joi_1.default.any(),
        password: joi_1.default.string().min(8).max(100),
    };
    return joi_1.default.validate(userUpdate, schema);
}
exports.validateUserUpdate = validateUserUpdate;
async function validateAddInformtionUser(userUpdate) {
    const schema = await {
        address: joi_1.default.string().min(11).max(315),
        age: joi_1.default.number(),
        gender: joi_1.default.number(),
        password: joi_1.default.string().min(8).max(100),
    };
    return joi_1.default.validate(userUpdate, schema);
}
exports.validateAddInformtionUser = validateAddInformtionUser;
async function validateUserPassword(userUpdate) {
    const schema = await {
        password: joi_1.default.string().min(8).max(100).required(),
        newPass: joi_1.default.string().min(8).max(100).required(),
    };
    return joi_1.default.validate(userUpdate, schema);
}
exports.validateUserPassword = validateUserPassword;
async function vaildavatar(userUpdate) {
    const schema = await {
        avatar: joi_1.default.date().required(),
    };
    return joi_1.default.validate(userUpdate, schema);
}
exports.vaildavatar = vaildavatar;
async function validateUserEmail(userUpdate) {
    const schema = await {
        email: joi_1.default.string().min(8).max(100).required(),
        password: joi_1.default.string().min(8).max(100).required(),
    };
    return joi_1.default.validate(userUpdate, schema);
}
exports.validateUserEmail = validateUserEmail;
//# sourceMappingURL=user.model.js.map