const aws = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")

// AWS Config
aws.config.update({
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    region: process.env.S3_BUCKET_REGION
})

const BUCKET = process.env.S3_BUCKET
const s3 = new aws.S3();

// Multer Middleware for S3 upload
const upload = multer({
    storage: multerS3({
        bucket: BUCKET,
        s3: s3,
        acl: "public-read",
        key: (req, file, cb)=>{
            // console.log(`file:${file}`)
            cb(null, file.originalname)
        }
    })
})

module.exports = upload
