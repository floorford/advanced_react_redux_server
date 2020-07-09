// config to setup passport (help us authenticate a user when they visit a protected route)
const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// a local strategy (called this cos its using our DB) to auth user with email & password
// tell localstrat where to look in request to see username
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, function (
  email,
  password,
  done
) {
  // verify username (email in our case) and password, call done with the user if it is the correct combo
  User.findOne({ email: email }, function (err, user) {
    // err only if large scale err like DB issue
    if (err) {
      return done(err);
    }

    if (!user) {
      // user wasn't found
      return done(null, false);
    }
    // saving a password = salt + plain password = salted & hashed password
    // comparing passwords = DB salted & hashed password vs. salt + submitted password (salted & hashed password)
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
  // otherwise, call done with false
});

// set up options for JWT strats
const jwtOptions = {
  // 1. expecting JWT strategy has access to JWT from request - figure out where it is
  // but it can sit anywhere: body, url, headers
  // so we have to tell it where to look on the request
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret,
  // 2. have to tell it the secret so it can decode the string to get the JWT
};

// create JWT strat
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // payload = decoded JWT
  // done = callback function from passport
  // sees if the user iD in the payload exists in our DB,
  // if yes, call done with user
  // else, call done without a user object

  User.findById(payload.sub, function (err, user) {
    // err only runs if can't access db or other fail larger case
    if (err) {
      return done(err, false);
    }

    if (user) {
      // found a user
      done(null, user);
    } else {
      // couldn't find user
      done(null, false);
    }
  });
});

// tell passport to use both strats
passport.use(jwtLogin);
passport.use(localLogin);
