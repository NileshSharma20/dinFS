const asyncHandler = require('express-async-handler')
const {cleanJsonData, localCSVtoJSON, createMongoDataBackup} = require("../helper/prodHelper")

const Shocker = require('../models/shockerModel')
const Brakeshoe = require('../models/brakeshoeModel')
const Discpad = require('../models/discpadModel')

// @desc   Get All Products
// @route  GET /api/prod
// @access Private
const getAllProd = asyncHandler(async (req,res)=>{
    var prod
    
    if(req.body.saveFile==="true"){
        switch(req.body.itemCode.toUpperCase()){
            case "SKR":
                prod = await Shocker.find().lean()
                break;
            case "BSH":
                prod = await Brakeshoe.find().lean()
                break;
            case "DPD":
                prod = await Discpad.find().lean()
                break;
            default:
                throw new Error('Specify Collection in body')
        }

        createMongoDataBackup(prod, req.body.itemCode.toUpperCase())
    }else{
        switch(req.body.itemCode.toUpperCase()){
            case "SKR":
                prod = await Shocker.find()
                break;
            case "BSH":
                prod = await Brakeshoe.find()
                break;
            case "DPD":
                prod = await Discpad.find()
                break;
            default:
                throw new Error('Specify Collection in body')
        }

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

// @desc   Get Specific SKU Product
// @route  GET /api/prod/findSKU
// @access Private
const getSKUProd = asyncHandler(async (req,res)=>{
    const iC = req.body.itemCode?req.body.itemCode.toUpperCase():""
    const vM = req.body.vehicleModel?req.body.vehicleModel.toUpperCase():""
    const bC = req.body.brandCompany?req.body.brandCompany.toUpperCase():""
    const spaceRemovedPN = req.body.partNum?req.body.partNum.replace(/ /g,""):""
    const cleanedPN = spaceRemovedPN.replace(/-/g,"") 
    const pN = cleanedPN.toUpperCase()

    var prod

    switch(req.body.itemCode.toUpperCase()){
        case "SKR":
            prod = await Shocker.find({ $and:[
                {sku: { $regex: iC}}, 
                {sku: { $regex: vM}}, 
                {sku: { $regex: bC}}, 
                {sku: { $regex: pN}}
            ]},{__v:0})
            break;
        case "BSH":
            prod = await Brakeshoe.find({ $and:[
                {sku: { $regex: iC}}, 
                {sku: { $regex: vM}}, 
                {sku: { $regex: bC}}, 
                {sku: { $regex: pN}}
            ]},{__v:0})
            break;
        case "DPD":
            prod = await Discpad.find({ $and:[
                {sku: { $regex: iC}}, 
                {sku: { $regex: vM}}, 
                {sku: { $regex: bC}}, 
                {sku: { $regex: pN}}
            ]},{__v:0})
            break;
        default:
            throw new Error("Add Item Code in body")
    }

    res.status(200).json(prod)
})

// @desc   Set Product
// @route  POST /api/prod
// @access Private
const setProd = asyncHandler(async (req,res)=>{
    if(!req.body.itemCode || !req.body.vehicleModel || !req.body.brandCompany ||
        !req.body.partNum || !req.body.mrp){
        res.status(400)
        throw new Error('Please fill all essential fields')
    }

    const prodObject = {
                        itemCode: req.body.itemCode,
                        vehicleModel: req.body.vehicleModel,
                        brandCompany: req.body.brandCompany,
                        partNum: req.body.partNum,
                        mrp: req.body.mrp,
                        compatibileModels: req.body.compatibileModels?req.body.compatibileModels:[],
                        metaData:{
                            colour: req.body.colour?req.body.colour:"",
                            position: req.body.position?req.body.position:"",
                            type: req.body.type?req.body.type:"",
                        },
                    }

    var prod

    switch(req.body.itemCode.toUpperCase()){
        case "SKR":
            prod = await Shocker.create(prodObject)
            break;
        case "BSH":
            prod = await Brakeshoe.create(prodObject)
            break;
        case "DPD":
            prod = await Discpad.create(prodObject)
            break;
        default:
            throw new Error("Add Item Code in body")
    }


    res.status(200).json(prod)
})

// @desc   Set Multiple Products
// @route  POST /api/prod/setMany
// @access Private
const setManyProd = asyncHandler(async (req,res)=>{

    const localJson = localCSVtoJSON(req.body.itemCode.toUpperCase())

    const cleanedJSON = cleanJsonData(localJson)

    const options = { ordered: true };

    var result
    switch(req.body.itemCode.toUpperCase()){
        case "SKR":
            result = await Shocker.insertMany(cleanedJSON, options);
            break;
        case "BSH":
            result = await Brakeshoe.insertMany(cleanedJSON, options);
            break;
        case "DPD":
            result = await Discpad.insertMany(cleanedJSON, options);
            break;
        default:
            throw new Error('Specify Collection in body')
    }

    // console.log(`${result.length} documents were inserted`);

    res.status(200).json({message: `${result.length} documents were inserted.`})
})

// @desc   Update specific Product
// @route  PUT /api/prod/:id
// @access Private
const updateProd = asyncHandler(async (req,res)=>{
    const prod = Shocker.findById(req.params.id)

    if(!prod){
        res.status(400)
        throw new Error('Product not found')
    }
    var updatedProd
    switch(req.body.itemCode.toUpperCase()){
        case "SKR":
            updatedProd = await Shocker.findByIdAndUpdate(req.params.id, req.body,{
                new: true,
            })
            break;
        case "BSH":
            updatedProd = await Brakeshoe.findByIdAndUpdate(req.params.id, req.body,{
                new: true,
            })
            break;
        case "DPD":
            updatedProd = await Discpad.findByIdAndUpdate(req.params.id, req.body,{
                new: true,
            })
            break;
        default:
            throw new Error('Specify Collection in body')
    }


    res.status(200).json(updatedProd)
})

// @desc   Delete specific Product
// @route  DELETE /api/prod/:id
// @access Private
const deleteProd = asyncHandler(async (req,res)=>{
    var prod

    switch(req.body.itemCode.toUpperCase()){
        case "SKR":
            prod = await Shocker.findById(req.params.id)
            break;
        case "BSH":
            prod = await Brakeshoe.findById(req.params.id)
            break;
        case "DPD":
            prod = await Discpad.findById(req.params.id)
            break;
        default:
            throw new Error('Specify Collection in body')
    }


    if(!prod){
        res.status(400)
        throw new Error('Product not found')
    }

    await prod.findOneAndRemove()

    res.status(200).json({id:req.params.id})
})

// @desc   Delete all Products from a Collection
// @route  DELETE /api/prod/deleteAll
// @access Private
const deleteAllProd = asyncHandler(async (req,res)=>{
    
    switch(req.body.itemCode.toUpperCase()){
        case "SKR":
            await Shocker.deleteMany({})
            break;
        case "BSH":
            await Brakeshoe.deleteMany({})
            break;
        case "DPD":
            await Discpad.deleteMany({})
            break;
        default:
            throw new Error('Specify Collection in body')
    }

    res.status(200).json({message:`Deleted All from Collection`})
})

module.exports = {
    getAllProd,
    getFilteredProd,
    getSKUProd,
    setProd,
    setManyProd,
    updateProd,
    deleteProd,
    deleteAllProd,
}