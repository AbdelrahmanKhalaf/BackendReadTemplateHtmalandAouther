"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config/config"));
const router = express_1.Router();
router.post("/", async (req, res) => {
    try {
        const { email, password } = await req.body;
        const { error } = validateUser(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        let user = await user_model_1.User.findOne({ email: email });
        if (!user)
            return res.status(400).send({
                error_en: "invalid email / or password",
                error_ar: "البريد الإلكتروني أو كلمة السر خاطئة",
            });
        const vailed = await bcryptjs_1.default.compare(password, user.password);
        console.log(password);
        if (!vailed)
            return res.status(400).send({
                error_en: "invalid email / or password",
                error_ar: "البريد الإلكتروني أو كلمة السر خاطئة",
            });
        jsonwebtoken_1.default.sign({ email: email }, config_1.default.JTWSecretPivate, (err, accses_tocken) => {
            if (err)
                return console.log(err);
            return res.header("Authentication", accses_tocken).status(200).send({
                user: user,
                bearer: accses_tocken,
            });
        });
        await user.save();
        return;
    }
    catch (ex) {
        throw new Error(ex);
    }
});
router.post("/admin", async (req, res) => {
    try {
        const { email, password } = await req.body;
        const { error } = validateUser(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        let user = await user_model_1.User.findOne({ email: email });
        if (!user)
            res.status(400).send({
                error_en: "invalid email / or password",
                error_ar: "البريد الإلكتروني أو كلمة السر خاطئة",
            });
        const vailed = await bcryptjs_1.default.compare(password, user.password);
        if (!vailed)
            return res.status(400).send({
                error_en: "invalid email / or password",
                error_ar: "البريد الإلكتروني أو كلمة السر خاطئة",
            });
        if (!user.isAdmin)
            return res.status(400).send({
                error_en: "you are not admin",
                error_ar: "  لست صاحب الموقع    ",
            });
        await user.save();
        const token = user.generaToken();
        return res.header("Authentication", token).status(200).send({
            user: user,
            bearer: token,
        });
    }
    catch (ex) {
        throw new Error(ex);
    }
});
function validateUser(auth) {
    const schema = {
        email: joi_1.default.string().email().min(8).max(315).email().required(),
        password: joi_1.default.string().min(8).max(315).required(),
    };
    return joi_1.default.validate(auth, schema);
}
exports.default = router;
//# sourceMappingURL=auth.router.js.map