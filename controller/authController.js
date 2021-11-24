const argon2 = require("argon2");
const User = require("../models/user.model");
const Tenant = require("../models/tenant.model");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");
const jwtHelper = require('../middleware/auth');
const isJwtExpired = require("jwt-check-expiration").isJwtExpired;
const db = require("../config/db.config");

class AuthController {
  async register(req, res) {
    const { tenantID, username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Username or password is incorrect" });
    const tenant = await Tenant.findOne({ _id: tenantID });
    if (!tenant)
      return res
        .status(400)
        .json({ success: false, message: "Tenant is not existed" });
    try {
      // Connect to tenant's database
      if (await db.connect(`${tenantID}`)) {
        // If create database  error
        return res
          .status(501)
          .json({ success: false, message: "Server error" });
      }

      // Check username
      const user = await User.findOne({ username });
      if (user)
        return res
          .status(400)
          .json({ success: false, message: "Username is existed" });

      // Create a new user and save
      const hashPW = await argon2.hash(password);
      const newUser = new User({ username, password: hashPW });
      await newUser.save();

      var userID = newUser._id;

      // Return token
      var company = tenant.companyName;
      const accessToken = jwtHelper.SignAccesToken({ tenantID, company, userID, username });
      const refreshToken = jwtHelper.GenerateRefreshToken({ tenantID, company, userID, username });

      // Save token
      // const newToken = new Token({ userID, token: accessToken });
      // await newToken.save();

      // Reconnect Main DB
      db.connect();
      res
        .status(200)
        .json({ success: true, message: "User created", token: {accessToken, refreshToken }});
    } catch (error) {
      db.connect();
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
  // Login funtion
  async login(req, res) {
    const { tenantID, username, password } = req.body;
    if (!username & !password)
      return res
        .status(403)
        .json({ success: false, message: "Username or password is incorrect" });
    const tenant = await Tenant.findOne({ _id: tenantID });
    if (!tenant)
      return res
        .status(403)
        .json({ success: false, message: "Tenant is not existed" });
    try {
      if (await db.connect(`${tenantID}`)) {
        // If create database  error
        return res
          .status(501)
          .json({ success: false, message: "Server error" });
      }
      // find user in DB
      const user = await User.findOne({ username });
      if (!user)
        return res.status(403).json({
          success: false,
          message: "Username or password is incorrect",
        });

      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid)
        return res.status(403).json({
          success: false,
          message: "Username or password is incorrect",
        });

      const userID = user._id;
      const filter = { userID };
      const accessToken = jwtHelper.SignAccesToken({ tenantID,company : tenant.companyName, userID, username });
      const refreshToken = jwtHelper.GenerateRefreshToken({ tenantID,company : tenant.companyName, userID, username });

      // // If token is expired
      // if (isJwtExpired(accessToken)) {
      //   const decodeToken = jwt.verify(
      //     accessToken,
      //     process.env.JWT_ACCESS_TOKEN
      //   );
      //   accessToken = jwt.sign(
      //     {
      //       tenantID: decodeToken.tenantID,
      //       company: decodeToken.company,
      //       userID,
      //       username,
      //     },
      //     process.env.JWT_ACCESS_TOKEN,
      //     {
      //       expiresIn: process.env.JWT_TIME,
      //     }
      //   );
      //   const update = { token: accessToken, updateAt: Date.now };
      //   token = await Token.findOneAndUpdate(filter, update);
      // }
      // token = await Token.findOne(filter);
      
      // Reconnect main DB 
      db.connect();
      res
        .status(200)
        .json({ success: true, message: "Logged in ", token: {accessToken, refreshToken }});

    } catch (error) {
      db.connect();
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = new AuthController();
