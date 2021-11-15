const express = require('express');
const router = express.Router();
const loginController =  require('../controller/loginController')


router.use('/:slug',loginController.show)

router.use('/',loginController.login)

module.exports = router ;
