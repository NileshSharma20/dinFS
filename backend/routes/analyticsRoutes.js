const express = require('express')
const router = express.Router()

const { demandSlipAggregateData,
        vehicleModelAggregateData,
        partNumberAggregateData
    } = require("../controllers/analyticsController")

const verifyJWT =  require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route("/demandSlip")
    .get(demandSlipAggregateData)

router.route("/vehicleModel")
    .get(vehicleModelAggregateData)

router.route("/partNum")
    .get(partNumberAggregateData)

module.exports = router