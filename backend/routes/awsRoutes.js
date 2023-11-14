const express = require('express')
const router = express.Router()
const { uploadS3File } = require('../controllers/awsUploadController')
const upload = require("../middleware/multerS3")

router.route("/uploadS3")
    .post(upload.single("file"), uploadS3File)
// router.route("/testUpload").post(uploadTest)

module.exports = router