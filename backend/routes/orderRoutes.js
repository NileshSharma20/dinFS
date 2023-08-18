const express = require('express')
const router = express.Router()
const { createNewDemandSlip, updateAfterDelivery } =  require("../controllers/orderController")

router.route("/")
        .post(createNewDemandSlip)

router.route("/:ticketId")
        .patch(updateAfterDelivery)

module.exports = router