const express = require('express');
const router = express.Router();
const projectController =  require('../controller/projectController')
const verifyToken = require('../middleware/verify')

router.post('/create', verifyToken, projectController.create)

router.get('/show', verifyToken, projectController.show)

module.exports = router