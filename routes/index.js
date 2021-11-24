var express = require('express');
var router = express.Router();
var authRouter = require('./auth.route')
const jwtToken = require('../middleware/auth')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', authRouter)

router.get('/token',jwtToken.VerifyAccessToken , (req,res) => res.send('Xin chao b da verify thanh cong'))

module.exports = router;
