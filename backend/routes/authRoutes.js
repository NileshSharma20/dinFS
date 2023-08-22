const express = require('express')
const router = express.Router()
const loginLimiter = require('../middleware/loginLimiter')
const { healthCheck,
        login, 
        refresh, 
        logout } = require("../controllers/authController")
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(verifyJWT, healthCheck)
    .post(loginLimiter,login)

router.route('/refresh').get(refresh)

router.route('/logout').post(logout)

module.exports = router