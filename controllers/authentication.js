const User = require("../models/user");

// using JWT package called JWT simple to create our JWTs
const jwt = require("jwt-simple");
const config = require("../config.js");

function tokenForUser(user) {
  // wouldn't use email cos user can change email, ID is most stable
  // sub: JWTs have a subject property (who the token belongs to)
  // iat: issued at time, another JWT property
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

// signup handler
exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide an email and password" });
  }

  // mongoose function
  User.findOne({ email: email }, function (err, existingUser) {
    // i.e. cannot connect to DB
    if (err) return next(err);

    if (existingUser) {
      // unprocessable entity
      return res.status(422).send({ error: "Email is in use" });
    }

    const user = new User({ email: email, password: password });

    user.save(function (err) {
      // i.e. cannot connect to DB
      if (err) return next(err);

      // want to send back the identifying JWT to the user so they can make authenticated requests
      res.json({ token: tokenForUser(user) });
    });
  });
};

// signin handler
exports.signin = function (req, res, next) {
  // User has already had email and password auth'd (with our localStrat middleware)
  // Just need to give the token
  // Need to access current user model in order to do this - have in our done callback in our localStrat middleware
  res.send({ token: tokenForUser(req.user) });
};

// JWT: https://jwt.io
// When signing up/in give a JWT in exchange for an id
// - encrypt User ID with secret string = JWT
// In the future, user should include JWT in their authenticated requests
// - decrypt JWT with secret string = User ID

// Secret string MUST be secret, paramount to app's security
