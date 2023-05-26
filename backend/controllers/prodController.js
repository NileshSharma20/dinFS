const asyncHandler = require('express-async-handler')

// @desc   Get Products
// @route  GET /api/prod
// @access Private
const getProd = asyncHandler(async (req,res)=>{
    res.status(200).json(`Get Products`)
})

// @desc   Set Products
// @route  POST /api/prod
// @access Private
const setProd = asyncHandler(async (req,res)=>{
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }
    res.status(200).json(`Set Products ${req.body.text}`)
})

// @desc   Get Products
// @route  PUT /api/prod/:id
// @access Private
const updateProd = asyncHandler(async (req,res)=>{
    res.status(200).json(`Update Product ${req.params.id}`)
})

// @desc   Get Products
// @route  DELETE /api/prod/:id
// @access Private
const deleteProd = asyncHandler(async (req,res)=>{
    res.status(200).json(`Delete Product ${req.params.id}`)
})

module.exports = {
    getProd,
    setProd,
    updateProd,
    deleteProd,
}