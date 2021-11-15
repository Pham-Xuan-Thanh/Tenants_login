// require(dotenv).config()
// const express = require('express')
// const router = express.Router()
const argon2 = require("argon2");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const db = require("../config/db/confdb");

class Auth {
  async register(req, res) {
    const { username, password } = req.body;
    if (!username & !password)
      return res
        .status(400)
        .json({ success: false, message: "Username or password is incorrect" });
    try {
      if (await db.connect(`mongodb://localhost:27017/${username}`)) {
        // If create error
        return res
          .status(501)
          .json({ success: false, message: "Server error" });
      }

      const user = await User.findOne({ username });
      if (user)
        return res
          .status(400)
          .json({ success: false, message: "Username is existed" });
      const hashPW = await argon2.hash(password);
      const newUser = new User({ username, password: hashPW });
      await newUser.save();

      // Return token
      const accessToken = jwt.sign(
        { username: username },
        process.env.ACCESS_TOKEN
      );
      res
        .status(200)
        .json({ success: true, message: "User created", jwt: accessToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    if (!username & !password)
      return res
        .status(400)
        .json({ success: false, message: "Username or password is incorrect" });
    try {
      if (await db.connect(`mongodb://localhost:27017/${username}`))
        // If connect fail
        return res
          .status(400)
          .json({
            success: false,
            message: "Username or password is incorrect",
          });
      // return res.status(501).json({success: false, message: "Server error"})
      const user = await User.findOne({ username });
      if (!user)
        res
          .status(400)
          .json({
            success: false,
            message: "Username or password is incorrect",
          });

      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid)
        res
          .status(400)
          .json({
            success: false,
            message: "Username or password is incorrect",
          });

      const accessToken = jwt.sign(
        { username: username },
        process.env.ACCESS_TOKEN
      );
      res
        .status(200)
        .json({ success: true, message: "Logged", jwt: accessToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = new Auth();
