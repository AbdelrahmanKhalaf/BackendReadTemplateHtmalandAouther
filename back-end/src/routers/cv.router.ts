import { NextFunction, Response, Router, Request } from "express";
import mailgun from "mailgun-js";
import multer from "multer";
import config from "../config/config"
import jwt from "jsonwebtoken";
import { AuthenticationMiddleware } from "../middleware/auth";
import { AuthuthrationMiddleware } from "../middleware/admin";
import { CV, validCv } from "../models/cv.model";
import decompress from 'decompress'
// storeage files  and change name 
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + ".zip");
    },
});
//flter file type just zip files 
const fileFilter = function fileFilter(
    req: any,
    file: { mimetype: string },
    cb: (arg0: null, arg1: boolean) => void
) {
    console.log(file.mimetype);
    if (file.mimetype === "application/zip" || file.mimetype === " application/vnd.rar") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
//liprire multer use to uplod file in path storage selected
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});
//type of file or files send 
const type = upload.single("file");
//router object
const router: Router = Router();
//METHOD : @POST
//PATH : upload/cv
router.post('/upload/cv', [AuthenticationMiddleware, AuthuthrationMiddleware, type], async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, dec, path } = req.body
        const { error }: any = validCv(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const fails = await decompress(req.file.path, 'uploads/dist', {
            map: file => {
                file.path = `${"cv_" + Date.now() + file.path}`;
                return file;
            }
        })
        const title = await CV.findOne({ name: name })
        if (title)
            return res.status(400).send({
                error_en: "alredy name is exited",
                error_ar: "الاسم موجد بي الفعل",
            });
        if (!fails) return res.status(400).send({
            error_en: "pleas add template",
            error_ar: "   من فضللك اضف الملف",
        });
        const cv = new CV({
            path: `uploads/dist/${fails[1].path}index.html`,
            name: name,
            dec: dec
        })
        cv.save();
        return res.status(200).send({ cv: cv })
    } catch (err) {

        return res.status(400).send({
            error_en: "pleas add template",
            error_ar: "   من فضللك اضف الملف",
        })
    }
})
//METHOD : @GET
//PATH : get/cvs
router.get('/get/cvs', async (req: Request, res: Response, next: NextFunction) => {
    const cv = await CV.find()
    res.status(200).send({ cvs: cv })
})
//METHOD : @GET
//PATH : details/cv/:id
router.get('/details/cv/:id', async (req: Request, res: Response, next: NextFunction) => {
    const cv = await CV.find({ _id: req.params.id })
    res.status(200).send({ cvs: cv })
})
// storeage image and change name 
const storageImage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + ".png");
    },
});
//flter file type just png or jpg imag 
const imageFilter = function fileFilter(
    req: any,
    file: { mimetype: string },
    cb: (arg0: null, arg1: boolean) => void
) {
    console.log(file.mimetype);
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
//liprire multer use to uplod iamge in path storage selected
const uploadImage = multer({
    storage: storageImage,
    fileFilter: imageFilter,
});
//type of file or files send 
const image = uploadImage.single("avatar");
//METHOD : @PUT
//PATH : update/image/:id
router.put('/upload/image/:id', [image], async (req: Request, res: Response, next: NextFunction) => {
    const cv = await CV.find({ _id: req.params.id })
    if (!cv[0])
        return res.status(400).send({
            error_en: "the cv with the id not found",
            error_ar: "هذا الملف غير موجد ",
        });
    await CV.update({ _id: req.params.id }, {
        $set: {
            avatar: req.params.file
        }
    })
    const newCv = await CV.find({ _id: req.params.id })
    return res.status(200).send({ cv: newCv })
})
export default router