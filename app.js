const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const logger = require("morgan");

const fidoRouter = require("./routes/PCFidoAuthen");
const adminsRouter = require("./routes/adminService");
const loginRouter = require("./routes/login");
const licenseRouter = require("./routes/license")
const userVerify = require("./routes/userVerify") 


const cors = require("cors");
const connect = require("./src/DB/mongodb");
//const ws = require("./src/wsService");

const licenseChecking = require("./middlewares/licenseChecking");
const middleLogger = require("./middlewares/logger");
const coustomLogger = require("./src/CoustomLogger").ServerLogger;
const accessControl = require("./middlewares/accessControl")
const ResData = require("./src/ResponseFormat");
const isSuperAdmin = require('./middlewares/isSuperAdmin')
const status = require('./src/value/statusCode')
let app = express();

connect();

isSuperAdmin();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use((req, res, next) => {
  console.log(req.statusCode);
  next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Custom middlewares
app.use(cookieParser());
app.use(licenseChecking());
app.use(middleLogger());
app.use(accessControl());

app.use("/v1/fido/u2f", fidoRouter);
app.use("/v1/license",licenseRouter);
app.use("/v1/login-admin", loginRouter);
app.use("/v1/verify-user-token", userVerify)
app.use("/v1/admin", adminsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.json(ResData.setResultErr("",status.NOT_FOUND.status,status.NOT_FOUND.msg ))
 // next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  coustomLogger.error(`Error statusCode : ${err.status} Error Message : ${err.message}`);
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
