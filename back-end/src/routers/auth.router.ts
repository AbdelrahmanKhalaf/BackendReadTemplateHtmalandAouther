import { Response, Router, Request } from "express";
import { User, Iusers } from "../models/user.model";
import joi, { any } from "joi";
import jwt from "jsonwebtoken";
import becrypt from "bcryptjs"
import config from "../config/config";
import { AnyKindOfDictionary, has } from "lodash";

const router: Router = Router();
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password }: any = await req.body;
    const { error }: any = validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    let user: any = await User.findOne({ email: email });
    if (!user)
      return res.status(400).send({
        error_en: "invalid email / or password",
        error_ar: "البريد الإلكتروني أو كلمة السر خاطئة",
      });
    const vailed = await becrypt.compare(password, user.password)
console.log(password);

    if (!vailed)
      return res.status(400).send({
        error_en: "invalid email / or password",
        error_ar: "البريد الإلكتروني أو كلمة السر خاطئة",
      });
 
    jwt.sign({ email: email }, config.JTWSecretPivate, (err: any, accses_tocken: any) => {
      if (err) return console.log(err);

      return res.header("Authentication", accses_tocken).status(200).send({
        user: user,
        bearer: accses_tocken,
      });
    })
    await user.save();
    return;
  } catch (ex) {
    throw new Error(ex);
  }
});

router.post("/admin", async (req: Request, res: Response) => {
  try {
    const { email, password }: any = await req.body;
    const { error }: any = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user: any = await User.findOne({ email: email });
    if (!user)
      res.status(400).send({
        error_en: "invalid email / or password",
        error_ar: "البريد الإلكتروني أو كلمة السر خاطئة",
      });
    const vailed = await becrypt.compare(password, user.password)
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
  } catch (ex) {
    throw new Error(ex);
  }
});
function validateUser(auth: any) {
  const schema = {
    email: joi.string().email().min(8).max(315).email().required(),
    password: joi.string().min(8).max(315).required(),
  };
  return joi.validate(auth, schema);
}
export default router;
