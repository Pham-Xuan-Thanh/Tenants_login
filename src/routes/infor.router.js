const express = require('express');
const router = express.Router();
const Infor =  require('../controller/inforController')
const verifyToken = require('../middleware/authenticate')

router.post('/create', verifyToken, Infor.create)

router.get('/show', verifyToken, Infor.show)

module.exports = router
