const express = require('express')
const router = express.Router()
const { createNewDemandSlip, 
        updateAfterDelivery,
        deleteDemandSlip } =  require("../controllers/orderController")
const verifyJWT = require('../middleware/verifyJWT')


router.route("/")
        .post(createNewDemandSlip)

router.route("/:ticketNumber")
        .patch(updateAfterDelivery)
        .delete(verifyJWT,deleteDemandSlip)

module.exports = router