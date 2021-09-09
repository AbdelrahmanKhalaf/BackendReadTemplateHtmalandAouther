import express, { Application } from "express";
import path from "path";
import mongoose from "mongoose";
import users from "./routers/user.router";
import login from "./routers/auth.router";
import socketIo from "socket.io";
import bodyParser from "body-parser";
import http from "http";
import config from "./config/config";
import cros from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import morgan from 'morgan'
import { errorHandler } from "./errors/error"
//routers path 
import cv from './routers/cv.router'
mongoose
  .connect(
    ``,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected to mongoDB...");
  })
  .catch((err) => console.log(`Could not connect to mongoDB...${err.message}`));
const app: Application = express();
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")
const server = http.createServer(app);
const io: any = socketIo(server);
app.use(morgan('dev'))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authentication, X-Requested-With");
    next();
  })
  .use(cros())
  .use(cookieParser())
  .use(session({ secret: config.secretSession, resave: false, saveUninitialized: false, }))
  .use(express.json())
  .use("/uploads", express.static("./uploads"))
  .use("/assets", express.static("./assets"))
  .use("/api/v1", users)
  .use("/api/v1/auth/login", login)
  .use("/api/v1/", cv)
  .use(errorHandler)
const PORT: any = config.port
server.listen(PORT, () => {
  console.log(`listing now to PORT ${PORT}...`);
});
process.on('unhandelRejection', (err, promise) => {
  console.log(`Error : ${err.message}`);
  //close server & exit process
  server.close(() => process.exit(1))


})
/// becrypt.compare => to Comparison encrypt
