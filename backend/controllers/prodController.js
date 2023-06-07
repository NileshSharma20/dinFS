const asyncHandler = require('express-async-handler')

const Shocker = require('../models/shockerModel')

// @desc   Get Products
// @route  GET /api/prod
// @access Private
const getProd = asyncHandler(async (req,res)=>{
    const prod = await Shocker.find()
    res.status(200).json(prod)
})

// @desc   Set Products
// @route  POST /api/prod
// @access Private
const setProd = asyncHandler(async (req,res)=>{
    if(!req.body.itemCode || !req.body.vehicleModel || !req.body.brandCompany ||
        !req.body.partNum || !req.body.mrp){
        res.status(400)
        throw new Error('Please add all essential fields')
    }

    const prod = await Shocker.create({
        itemCode: req.body.itemCode,
        vehicleModel: req.body.vehicleModel,
        brandCompany: req.body.brandCompany,
        partNum: req.body.partNum,
        mrp: req.body.mrp,
        colour: req.body.colour?req.body.colour:"",
        position: req.body.position?req.body.position:"",
        type: req.body.type?req.body.type:"",
        compatibileModels: req.body.compatibileModels?req.body.compatibileModels:[],
    })

    res.status(200).json(prod)
})

// @desc   Get Products
// @route  PUT /api/prod/:id
// @access Private
const updateProd = asyncHandler(async (req,res)=>{
    const prod = Shocker.findById(req.params.id)

    if(!prod){
        res.status(400)
        throw new Error('Product not found')
    }

    const updatedProd = await Shocker.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
    })


    res.status(200).json(updatedProd)
})

// @desc   Get Products
// @route  DELETE /api/prod/:id
// @access Private
const deleteProd = asyncHandler(async (req,res)=>{
    // Shocker.findByIdAndDelete(req.params.id)
    const prod = Shocker.findById(req.params.id)

    if(!prod){
        res.status(400)
        throw new Error('Product not found')
    }

    await prod.findOneAndRemove()

    res.status(200).json({id:req.params.id})
})

module.exports = {
    getProd,
    setProd,
    updateProd,
    deleteProd,
}