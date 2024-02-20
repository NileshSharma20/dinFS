const express = require('express')
const router = express.Router()

const { demandSlipAggregateData } = require("../controllers/analyticsController")
const verifyJWT =  require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route("/demandSlip")
    .get(demandSlipAggregateData)

module.exports = router