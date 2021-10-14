const express = require("express");
const {
  userRegister,
  userLogin,
  userEmailVerify,
  addShortLink,
  updateUserUrlClicks,
  getUserUrlsStatics,
} = require("../controllers/userControllers");

const Router = express.Router();

Router.post("/register", userRegister);
Router.get("/verification/:token", userEmailVerify);
Router.post("/login", userLogin);
Router.post("/shorturl", addShortLink);
Router.put("/shorturl/:shrt", updateUserUrlClicks);
Router.get("/shorturl", getUserUrlsStatics);
module.exports = Router;
