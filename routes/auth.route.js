var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth')
var authController =  require('../controller/authController')
/* GET users listing. */
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout',auth.VerifyAccessToken, authController.logout);

module.exports = router;
