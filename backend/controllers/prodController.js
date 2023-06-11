const asyncHandler = require('express-async-handler')
const {cleanJsonData, createMongoDataBackup} = require("../helper/prodHelper")

const Shocker = require('../models/shockerModel')

// @desc   Get All Products
// @route  GET /api/prod
// @access Private
const getAllProd = asyncHandler(async (req,res)=>{
    var prod
    
    if(req.body.saveFile==="true"){
        prod = await Shocker.find().lean()

        createMongoDataBackup(prod)
    }else{
        prod = await Shocker.find()

    }
    res.status(200).json(prod)
})

// @desc   Get Specific Product
// @route  GET /api/prod/findSpecific
// @access Private
const getFilteredProd = asyncHandler(async (req,res)=>{
    const prod = await Shocker.find(req.body)
    res.status(200).json(prod)
})

// @desc   Set Products
// @route  POST /api/prod
// @access Private
const setProd = asyncHandler(async (req,res)=>{
    if(!req.body.itemCode || !req.body.vehicleModel || !req.body.brandCompany ||
        !req.body.partNum || !req.body.mrp){
        res.status(400)
        throw new Error('Please fill all essential fields')
    }

    // console.log(`vehicleModel: ${req.body.vehicleModel}, type:${typeof req.body.vehicleModel}`)

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

// @desc   Set Multiple Products
// @route  POST /api/prod/setMany
// @access Private
const setManyProd = asyncHandler(async (req,res)=>{
    const prod =[{
        itemCode: "SKR",
        vehicleModel: "DISCOVER-135        ",
        brandCompany: "BAJAJ",
        partNum: "JN122000        ",
        mrp: "1277        ",
        colour: "",
        position: "REAR",
        type: "DOUBLE",
        compatibileModels: "SKR-DIS100-BAJ-JN122000        ",
    },
    {
        itemCode: "SKR",
        vehicleModel: "DISCOVER-100        ",
        brandCompany: "BAJAJ        ",
        partNum: "JN122000        ",
        mrp: "1,277        ",
        colour: "",
        position: "REAR",
        type: "DOUBLE",
        compatibileModels: "SKR-DIS135-BAJ-JN122000   ",
    },]

    const cleanedJSON = cleanJsonData(prod)

    const options = { ordered: true };

    const result = await Shocker.insertMany(cleanedJSON, options);

    console.log(`${result.length} documents were inserted`);

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
    getAllProd,
    getFilteredProd,
    setProd,
    setManyProd,
    updateProd,
    deleteProd,
}