// route handler

const Authentication = require("./controllers/authentication");

// export function, use in index.js - pass app into it, now we can access app here
module.exports = function(app) {
  // get function = GET HTTP request
  // 1st arg = route
  // req = incoming http request object
  // res = response object we will send back
  // next = error handling mostly

  app.post("/signup", Authentication.signup);
};
