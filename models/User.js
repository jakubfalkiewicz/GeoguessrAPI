const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: false, default: "" },
  admin: { type: Boolean, default: false },
  experience: { type: Number, default: 0 },
  registrationDate: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = model("User", userSchema);
