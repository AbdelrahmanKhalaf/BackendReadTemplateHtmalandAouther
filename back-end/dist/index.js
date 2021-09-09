"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const socket_io_1 = __importDefault(require("socket.io"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./config/config"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./errors/error");
const cv_router_1 = __importDefault(require("./routers/cv.router"));
mongoose_1.default
    .connect(``, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("connected to mongoDB...");
})
    .catch((err) => console.log(`Could not connect to mongoDB...${err.message}`));
const app = express_1.default();
app.set('views', path_1.default.join(__dirname, 'views'));
app.set("view engine", "ejs");
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
app.use(morgan_1.default('dev'))
    .use(body_parser_1.default.urlencoded({ extended: false }))
    .use(body_parser_1.default.json())
    .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authentication, X-Requested-With");
    next();
})
    .use(cors_1.default())
    .use(cookie_parser_1.default())
    .use(express_session_1.default({ secret: config_1.default.secretSession, resave: false, saveUninitialized: false, }))
    .use(express_1.default.json())
    .use("/uploads", express_1.default.static("./uploads"))
    .use("/assets", express_1.default.static("./assets"))
    .use("/api/v1", user_router_1.default)
    .use("/api/v1/auth/login", auth_router_1.default)
    .use("/api/v1/", cv_router_1.default)
    .use(error_1.errorHandler);
const PORT = config_1.default.port;
server.listen(PORT, () => {
    console.log(`listing now to PORT ${PORT}...`);
});
process.on('unhandelRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    server.close(() => process.exit(1));
});
//# sourceMappingURL=index.js.map