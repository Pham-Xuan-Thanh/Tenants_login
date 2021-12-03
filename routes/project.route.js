var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth')
var projectController =  require('../controller/projectController')
/* GET users listing. */
router.post('/add', auth.VerifyAccessToken, projectController.add);
router.get('/show', auth.VerifyAccessToken, projectController.show);

module.exports = router;
