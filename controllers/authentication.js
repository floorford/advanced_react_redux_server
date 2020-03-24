const User = require("../models/user");

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide an email and password" });
  }

  // mongoose function
  User.findOne({ email: email }, function(err, existingUser) {
    // i.e. cannot connect to DB
    if (err) return next(err);

    if (existingUser) {
      // unprocessable entity
      return res.status(422).send({ error: "Email is in use" });
    }

    const user = new User({ email: email, password: password });

    user.save(function(err) {
      // i.e. cannot connect to DB
      if (err) return next(err);

      res.json({ success: true });
    });
  });
};
