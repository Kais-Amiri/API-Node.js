const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
const shortId = require("shortid");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  emailObject: {
    email: {
      type: String,
      validate: [isEmail],
      required: true,
      trim: true,
      lowercase: true,
    },
    verification: { type: Boolean, default: false },
  },
  password: { type: String, required: true },
  userUrls: [
    {
      url: { type: String, trim: true },
      shortUrl: { type: String, default: shortId.generate },
      clicks: { type: Number, default: 0 },
    },
  ],
});

//------------- encrypting the password before sending it to Db--------------------
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
