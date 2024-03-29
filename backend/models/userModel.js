const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true, unqiue: true },
    password: { type: "String", required: true },
    activated: { type: Boolean },
    activationKey: { type: String, default: "" },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    publicKey: {
      type: "String"
    },
    privateKeyCipher: {
      type: "String"
    },
    bio: {
      type: "String", default: ""
    },
  },
  {
    timestaps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (input) {
  return await bcrypt.compare(input, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
