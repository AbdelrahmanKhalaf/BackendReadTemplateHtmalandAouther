"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const cv_model_1 = require("../models/cv.model");
const decompress_1 = __importDefault(require("decompress"));
const storage = multer_1.default.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + ".zip");
    },
});
const fileFilter = function fileFilter(req, file, cb) {
    console.log(file.mimetype);
    if (file.mimetype === "application/zip" || file.mimetype === " application/vnd.rar") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer_1.default({
    storage: storage,
    fileFilter: fileFilter,
});
const type = upload.single("file");
const router = express_1.Router();
router.post('/upload/cv', [auth_1.AuthenticationMiddleware, admin_1.AuthuthrationMiddleware, type], async (req, res, next) => {
    try {
        const { name, dec, path } = req.body;
        const { error } = cv_model_1.validCv(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const fails = await decompress_1.default(req.file.path, 'uploads/dist', {
            map: file => {
                file.path = `${"cv_" + Date.now() + file.path}`;
                return file;
            }
        });
        const title = await cv_model_1.CV.findOne({ name: name });
        if (title)
            return res.status(400).send({
                error_en: "alredy name is exited",
                error_ar: "الاسم موجد بي الفعل",
            });
        if (!fails)
            return res.status(400).send({
                error_en: "pleas add template",
                error_ar: "   من فضللك اضف الملف",
            });
        const cv = new cv_model_1.CV({
            path: `uploads/dist/${fails[1].path}index.html`,
            name: name,
            dec: dec
        });
        cv.save();
        return res.status(200).send({ cv: cv });
    }
    catch (err) {
        return res.status(400).send({
            error_en: "pleas add template",
            error_ar: "   من فضللك اضف الملف",
        });
    }
});
router.get('/get/cvs', async (req, res, next) => {
    const cv = await cv_model_1.CV.find();
    res.status(200).send({ cvs: cv });
});
router.get('/details/cv/:id', async (req, res, next) => {
    const cv = await cv_model_1.CV.find({ _id: req.params.id });
    res.status(200).send({ cvs: cv });
});
const storageImage = multer_1.default.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + ".png");
    },
});
const imageFilter = function fileFilter(req, file, cb) {
    console.log(file.mimetype);
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const uploadImage = multer_1.default({
    storage: storageImage,
    fileFilter: imageFilter,
});
const image = uploadImage.single("avatar");
router.put('/upload/image/:id', [image], async (req, res, next) => {
    const cv = await cv_model_1.CV.find({ _id: req.params.id });
    if (!cv[0])
        return res.status(400).send({
            error_en: "the cv with the id not found",
            error_ar: "هذا الملف غير موجد ",
        });
    await cv_model_1.CV.update({ _id: req.params.id }, {
        $set: {
            avatar: req.params.file
        }
    });
    const newCv = await cv_model_1.CV.find({ _id: req.params.id });
    return res.status(200).send({ cv: newCv });
});
exports.default = router;
//# sourceMappingURL=cv.router.js.map