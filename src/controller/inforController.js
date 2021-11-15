const argon2 = require("argon2");
const Infor = require("../models/infor");
// const jwt = require('jsonwebtoken')
const db = require("../config/db/confdb");

class Information {
  async create(req, res) {
    const { name, description, startAt, endAt } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "The project is existed" });


    try {
      if (await db.connect(`mongodb://localhost:27017/${req.username}`)) {
        // If cant connect to db
        return res
          .status(501)
          .json({ success: false, message: "Server error" });
      }
      const infor = await Infor.findOne({ name }); // Find a name of project if its existed
      if (infor)
        return res
          .status(401)
          .json({ success: false, message: "This project is existed" });
      const newInfor = new Infor({
        name,
        description: description || "None Descript",
        startAt: startAt,
        endAt: endAt,
      });
      await newInfor.save();

      res.json({ success: true, message: "Added" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async show(req, res) {
    try {
      if (await db.connect(`mongodb://localhost:27017/${req.username}`)) {
        // If cant connect to db
        return res
          .status(501)
          .json({ success: false, message: "Server error" });
      }
    //   const query = { name: "*" };
      const infor = await Infor.find({});
      console.log(infor)
      res.json({ success: true, message: "Infomation of project", information: infor });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = new Information();
