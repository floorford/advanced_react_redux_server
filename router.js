// route handler

const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");
const passport = require("passport");

// telling to use jwts, and when user is authenticated don't try and create cookie session for them
// dont want that as using jwt
// this is a middleware helper which will intercept routes which require auth and check first
const requireAuth = passport.authenticate("jwt", { session: false });

// this helper intercepts signup request
const requireSignin = passport.authenticate("local", { session: false });

// export function, use in index.js - pass app into it, now we can access app here
module.exports = function (app) {
  // get function = GET HTTP request
  // 1st arg = route
  // 2nd arg = middleware (requireAuth)
  // req = incoming http request object
  // res = response object we will send back
  // next = error handling mostly

  app.get("/", requireAuth, function (req, res) {
    res.send({ hi: "there" });
  });
  app.post("/signup", Authentication.signup);
  app.post("/signin", requireSignin, Authentication.signin);
};
