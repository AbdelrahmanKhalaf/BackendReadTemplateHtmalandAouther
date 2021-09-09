import { NextFunction, Request, Response } from "express";
import { ErorrResponse } from "../errors/errorResponse";
const jwt = require("jsonwebtoken");
const config = require("config");
export const AuthuthrationMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {    
    if (res.locals.user && !res.locals.user.isAdmin) return new ErorrResponse("Accsess denied",401)
    next();
  } catch (err) {
    next(new ErorrResponse(err,400));
  }
  return;
};
