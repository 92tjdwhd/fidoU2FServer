const loggerCustom = require("../src/CoustomLogger");

const Connectionlog = () => (req, res, next) => {
  const log = `${req.method} ${req.url} ==> body : ${JSON.stringify(req.body)} ==> ip :${req.ip}`;
  loggerCustom.ServerLogger.info(log)
 // loggerCustom.error(res.status(err.status || 500))
  next();
};

module.exports = Connectionlog;