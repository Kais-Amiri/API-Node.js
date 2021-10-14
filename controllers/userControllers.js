const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const emailVerify = require("../authentification/emailVerify");
const bcrypt = require("bcryptjs");

//------------- user registration ----------------------------
const userRegister = async (req, res) => {
  try {
    const newUser = await new User({ ...req.body });

    const searchResult = await User.findOne({
      "emailObject.email": newUser.emailObject.email,
    });

    if (!searchResult) {
      const { _id, firstName, lastName, emailObject } = await newUser.save();
      //----------------------- jwt ----------------------------
      const payload = {
        _id,
        firstName,
        lastName,
      };

      const token = await jwt.sign(
        payload,
        process.env.emailSecretOrPrivateKey
      );
      emailVerify(
        "http://localhost:8080/verification/",
        emailObject.email,
        token
      );

      res.status(200).json({
        msg: "You have been registered successfully, Please check your email to verify your account !",
      });
    } else {
      res.status(400).json({ msg: "Email not valid" });
    }
  } catch (error) {
    res.status(400).json(error._message);
  }
};

//----------------------- user email verification -----------

const userEmailVerify = async (req, res) => {
  const userInfo = await jwt.verify(
    req.params.token,
    process.env.emailSecretOrPrivateKey
  );
  try {
    await User.findByIdAndUpdate(
      { _id: userInfo._id },
      { $set: { "emailObject.verification": true } }
    );
    res.status(200).json({ msg: "Your account have been verified !!!" });
  } catch (error) {
    res.status(400).json({ Error: Error_message });
  }
};
//--------------------- user login -------------------------
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await User.findOne(
      { "emailObject.email": email },
      "firstName lastName emailObject password"
    );

    if (!userInfo) return res.status(400).json({ message: "bad credentials" });
    if (userInfo.emailObject.verification === false)
      return res
        .status(200)
        .json({ message: "Please check your email to verify your account ! " });
    const isMatchPassword = await bcrypt.compare(password, userInfo.password);

    if (!isMatchPassword)
      return res.status(400).json({ message: "bad credentials" });

    const payload = {
      _id: userInfo._id,
      firstName: userInfo.firstName,
      lastnName: userInfo.lastName,
    };

    const token = await jwt.sign(payload, process.env.secretOrPrivateKey);
    res
      .status(200)
      .json({ msg: "login with success", token: `Bearer ${token}` });
  } catch (error) {
    res.status(400).json(error._message);
  }
};

//----------------- generate an url --------------------
const addShortLink = async (req, res) => {
  const { id, url } = await req.body;
  try {
    const userInfo = await User.findById({ _id: id });
    await userInfo.userUrls.push({ url });
    await userInfo.save();
    res.status(200).json({ msg: "Short url created successfully !!!" });
  } catch (error) {
    res.status(400).json({ Error: Error_message });
  }
};

//----------------- update the clicks on the url --------------------------
const updateUserUrlClicks = async (req, res) => {
  const shortUrl = await req.params.shrt;
  const { id } = await req.body;
  try {
    const userInfo = await User.findById({ _id: id });
    await userInfo.userUrls.map((el) =>
      el.shortUrl === shortUrl ? { ...el, clicks: ++el.clicks } : el
    );
    await userInfo.save();
    res.status(200).json({
      msg: "The number of clicks have been incremented successfully !!!",
    });
  } catch (error) {
    res.status(400).json({ Error: Error_message });
  }
};

//------------------- get the user's urls and there statics -------------------------
const getUserUrlsStatics = async (req, res) => {
  const id = req.headers["id"];
  try {
    const userUrls = await User.findById({ _id: id }, "userUrls");
    res.status(200).json({ userAndStatics: userUrls });
  } catch (error) {
    res.status(400).json({ Error: error._message });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userEmailVerify,
  addShortLink,
  updateUserUrlClicks,
  getUserUrlsStatics,
};
