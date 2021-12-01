var express = require('express');
var router = express.Router();
var authRouter = require('./auth.route')
const jwtToken = require('../middleware/auth');
const authController = require('../controller/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', authRouter)

router.get('/token', authController.refreshToken)

module.exports = router;
