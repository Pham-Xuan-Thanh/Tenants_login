const express = require('express');
const router = express.Router();
const Auth =  require('../controller/authController')


router.post('/register', Auth.register)

router.get('/login', Auth.login)

module.exports = router
