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


router.route("/")
        .post(createNewDemandSlip)
        .get(verifyJWT, getAllDemandSlips)
        .delete(verifyJWT,deleteAllDemandSlip)

router.route("/:ticketNumber")
        .patch(updateAfterDelivery)
        .delete(verifyJWT,deleteDemandSlip)

router.route("/filter/:date")
        .post(verifyJWT,getFilteredDemandSlips)

router.route("/reset/history")
        .delete(verifyJWT,deleteAllDemandHistory)

module.exports = router