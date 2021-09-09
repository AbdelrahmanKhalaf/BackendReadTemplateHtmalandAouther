import { NextFunction, Request, Response } from "express";
import { User, validateUser, Iusers } from "../models/user.model";

const jwt = require("jsonwebtoken");
import config from "../config/config"
import { ErorrResponse } from "../errors/errorResponse";

export const AuthenticationMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //Get Token From Header Of Request And Check If Token Is Exist
    const token: string | undefined = req.header("Authentication");
    if (!token) return res.status(500).send({ error_ar: "الوصول مرفوض ، لم يتم توفير رمز مميز", error_en: "denied" });

    //decoded Token And Find In Mongoo db By id Then CHeck If user Exist
    const decoded: any = jwt.verify(token, config.JTWSecretPivate
    );    
    const user = await User.find({email:decoded.email});
    if (!user) return res.status(500).send(`Invalid Token with Id of ${decoded._id}`);
    //if (!user.status) return res.status(400).send('user not active');
    // Set Current User To locals
    res.locals.user = user[0]    
    // call next Middleware
    return next();
  } catch (ex) {
    next(ex);
    
  }
};
