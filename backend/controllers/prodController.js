const asyncHandler = require('express-async-handler')
const {cleanJsonData, localCSVtoJSON, createMongoDataBackup} = require("../helper/prodHelper")

// const Shocker = require('../models/shockerModel')
// const Brakeshoe = require('../models/brakeshoeModel')
// const Discpad = require('../models/discpadModel')
// const Mobilfilter = require('../models/mobilFilterModel')

const dbCollectionList ={
    "SKR":"shockerModel",
    "BSH":"brakeshoeModel",
    "DPD":"discpadModel",
    "MOF":"mobilFilterModel",
}

// @desc   Get All Products
// @route  GET /api/prod
// @access Private
const getAllProd = asyncHandler(async (req,res)=>{
    var prod, dbCollection 

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(req.body.itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }
    
    //Checking if we want to create Local CSV file or not
    if(req.body.saveFile==="true"){
        prod = await dbCollection.find().lean()
        createMongoDataBackup(prod, req.body.itemCode.toUpperCase())
    }else{
        prod = await dbCollection?.find()

    }
    res.status(200).json(prod)
})

// @desc   Get Specific Product
// @route  GET /api/prod/findSpecific
// @access Private

// const getFilteredProd = asyncHandler(async (req,res)=>{
//     const prod = await Shocker.find(req.body)
//     res.status(200).json(prod)
// })

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

    var prod, dbCollection

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(req.body.itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }

    prod = await dbCollection.find({ $and:[
        {sku: { $regex: iC}}, 
        {sku: { $regex: vM}}, 
        {sku: { $regex: bC}}, 
        {sku: { $regex: pN}}
    ]},{__v:0})

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

    var prod, dbCollection

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(req.body.itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }

    prod = await dbCollection.create(prodObject)

    res.status(200).json(prod)
})

// @desc   Set Multiple Products
// @route  POST /api/prod/setMany
// @access Private
const setManyProd = asyncHandler(async (req,res)=>{

    const localJson = localCSVtoJSON(req.body.itemCode.toUpperCase())

    const cleanedJSON = cleanJsonData(localJson)

    const options = { ordered: true };

    var result, dbCollection
    
    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(req.body.itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }
    
    result = await dbCollection.insertMany(cleanedJSON, options);

    res.status(200).json({message: `${result.length} documents were inserted.`})
})

// @desc   Update specific Product
// @route  PUT /api/prod/:id
// @access Private
const updateProd = asyncHandler(async (req,res)=>{
    // const prod = Shocker.findById(req.params.id)

    // if(!prod){
    //     res.status(400)
    //     throw new Error('Product not found')
    // }
    var updatedProd, dbCollection

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(req.body.itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }

    updatedProd = await dbCollection.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
    })


    res.status(200).json(updatedProd)
})

// @desc   Delete specific Product
// @route  DELETE /api/prod/:id
// @access Private
const deleteProd = asyncHandler(async (req,res)=>{
    var prod, dbCollection

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(req.body.itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }

    prod = await dbCollection.findById(req.params.id)

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
    var dbCollection

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(req.body.itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }

    await dbCollection.deleteMany({})
    res.status(200).json({message:`Deleted All from Collection`})
})

module.exports = {
    getAllProd,
    // getFilteredProd,
    getSKUProd,
    setProd,
    setManyProd,
    updateProd,
    deleteProd,
    deleteAllProd,
}