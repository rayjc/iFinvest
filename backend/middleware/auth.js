/** Middleware for handling req authorization for routes. */
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");


/** Middleware: Authenticate user. */
function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body.token || req.query.token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}


/** Middleware: Requires user is authenticated. */
function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized; missing or invalid token" });
  } else {
    return next();
  }
}


/** Middleware: Requires correct userId. */
function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.id === +req.params.userId) {
      return next();
    } else {
      return next({ status: 401, message: `Unauthorized; only user with id:${req.params.userId} is allowed` });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized; missing or invalid token" });
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
};
