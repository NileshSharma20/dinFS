const express = require('express')
const router = express.Router()
const { createNewBill,
        getAllBills,
        getFilteredBills } = require("../controllers/billController")
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)

router.route("/")
            .post(createNewBill)
            .get(getAllBills)

router.route("/filter")
            .get(getFilteredBills)

module.exports = router