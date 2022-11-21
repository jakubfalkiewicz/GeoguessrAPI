const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// Pole „_id” (które ma modelować userId) dodawane jest domyślnie, dlatego pomijamy je w deklaracji
const userSchema = new Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: false, default: "" },
  admin: { type: Boolean, default: false },
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
