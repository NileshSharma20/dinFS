const express = require('express')
const router = express.Router()
const { createNewDemandSlip, 
        getAllDemandSlips,
        getFilteredDemandSlips,
        updateAfterDelivery,
        deleteDemandSlip,
        deleteAllDemandSlip,
        deleteAllDemandHistory } =  require("../controllers/orderController")
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route("/")
        .post(createNewDemandSlip)
        .get(getAllDemandSlips)
        .delete(deleteAllDemandSlip)

router.route("/:ticketNumber")
        .patch(updateAfterDelivery)
        .delete(deleteDemandSlip)

router.route("/filter")
        // .post(getFilteredDemandSlips)
        .get(getFilteredDemandSlips)

router.route("/reset/history")
        .delete(deleteAllDemandHistory)

module.exports = router