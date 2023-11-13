const express = require("express")
const router = express.Router()
const userCtrl = require('../controller/user')

router.all('/signup',userCtrl.signup )
router.all('/login' , userCtrl.login)

module.exports = router