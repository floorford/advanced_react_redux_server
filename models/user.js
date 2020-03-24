const mongoose = require("mongoose");
// ORM for mongoDB

// to run mongo - go to docs!

const Schema = mongoose.Schema;
// how we tell mongoose what the fields our model has

const bcrypt = require("bcrypt-nodejs");

// Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password
// runs before saving model
userSchema.pre("save", function(next) {
  // get access to user model
  // (user = instance of user model)
  const user = this;

  // using bcrypt library genSalt function
  // passing in callback to ensure synchronisity
  bcrypt.genSalt(10, function(err, salt) {
    // error handling
    if (err) return next(err);

    // hashes password using salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);

      // overwrite plain text with encrypted version
      user.password = hash;

      // go ahead save model, prehook finished
      next();
    });
  });
});

// Create model class
const ModelClass = mongoose.model("user", userSchema);

// export model
module.exports = ModelClass;
