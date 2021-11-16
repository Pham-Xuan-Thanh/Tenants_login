const argon2 = require("argon2");
const Project = require("../models/Project");
// const jwt = require('jsonwebtoken')
const db = require("../config/db");

class ProjectController {
    async create(req, res) {
      const { name, description, startAt, endAt } = req.body;
      if (!name)
        return res
          .status(400)
          .json({ success: false, message: "The project is existed" });
  
  
      try {
        if (await db.connect(`${req.username}`)) {
          // If cant connect to db
          return res
            .status(501)
            .json({ success: false, message: "Server error" });
        }

        const project = await Project.findOne({ name }); // Find a name of project if its existed
        if (project)
          return res
            .status(401)
            .json({ success: false, message: "This project is existed" });
        // Create new instance to save to DB   
        const newProject = new Project({
          name,
          description: description || "None Description",
          startAt: startAt,
          endAt: endAt,
        });
        await newProject.save();
  
        res.json({ success: true, message: "Created!!!" });
        // db.connect();
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
      }
    }
  
    async show(req, res) {
      try {
        if (await db.connect(`${req.username}`)) {
          // If cant connect to db
          return res
            .status(501)
            .json({ success: false, message: "Server error" });
        }
      //   const query = { name: "*" };
        let project = await Project.find({});
        project = project.map( (query) => {

          const object = query.toObject();
          
          const { _id , __v, ...rest} = object;
          return rest;
        });
          

        res.json({ success: true, message: "Infomation of project", information: project });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
      }
    }
  }
  
  module.exports = new ProjectController();