const mongoose = require("mongoose");
// ORM for mongoDB

// to run mongo - go to docs!

const Schema = mongoose.Schema;
// how we tell mongoose what the fields our model has

// Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// Create model class
const ModelClass = mongoose.Model("user", userSchema);

// export model
module.exports(ModelClass);
