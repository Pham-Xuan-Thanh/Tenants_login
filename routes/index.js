var express = require('express');
var router = express.Router();
var authRouter = require('./auth.route')
var projectRouter = require('./project.route')
const authController = require('../controller/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', authRouter)
router.use('/project', projectRouter)

router.get('/token', authController.refreshToken)

module.exports = router;
