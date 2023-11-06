const asyncHandler = require('express-async-handler')

// @desc   Create a new Demand Slip
// @route  POST /api/order/
// @access Private
const uploadS3File = asyncHandler(async(req,res)=>{
    console.log(req.file)
    res.status(200).json({message:`fileLink: ${req.file.location}`})
})

module.exports={
    uploadS3File,
}