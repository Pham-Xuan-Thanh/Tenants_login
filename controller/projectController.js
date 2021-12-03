const Project = require("../models/project.model");
const Tenant = require("../models/tenant.model");
const db = require("../config/db.config");

class ProjectController {
  async add(req, res) {
    const { projectName, description } = req.body;
    const userData = req.userData;
    if (!projectName)
      return res.status(403).json({ success: false, message: "no name" });
    try {
      const tenantID = userData.tenantID;
      const tenant = await Tenant.findOne({ _id: tenantID });
      if (!tenant)
        return res.status(403).json({ success: false, message: "no tenant" });

      if (await db.connect(`${tenantID}`)) {
        // If connect database  error
        return res
          .status(501)
          .json({ success: false, message: "Server error" });
      }

      const project = await Project.findOne({ projectName });
      if (project)
        return res
          .status(403)
          .json({ success: false, message: "invalid project" });

      const newProject = new Project({
        projectName,
        description,
        userCreated: userData.userID,
      });
      await newProject.save();
      // Reconnect Main DB
      db.connect();
      res.status(200).json({
        success: true,
        message: "Project created",
        data: { projectName, description },
      });
    } catch (err) {
      db.connect();
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
  // Show all project this user created
  async show(req, res) {
    const userData= req.userData;
    try {
      const tenantID = userData.tenantID;
      const tenant = await Tenant.findOne({ _id: tenantID });
      if (!tenant)
        return res.status(403).json({ success: false, message: "no tenant" });

      if (await db.connect(`${tenantID}`)) {
        // If connect database  error
        return res
          .status(501)
          .json({ success: false, message: "Server error" });
      }

      const project = await Project.find({ userCreated: userData.userID });
      if (!project) {
        db.connect();
        return res
          .status(403)
          .json({ success: false, message: "invalid project" });
      }

      const result = project.map((p) => ({
        name : p.projectName,
        desc : p.description
      }));
      // Reconnect Main DB
      db.connect();
      res.status(200).json({
        success: true,
        message: `All project of ${userData.username}`,
        data: result,
      });
    } catch (err) {
      db.connect();
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
}

module.exports = new ProjectController();
