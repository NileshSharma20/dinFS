const asyncHandler = require('express-async-handler')
const {cleanJsonData, localCSVtoJSON } = require("../helper/prodHelper")

// const Shocker = require('../models/shockerModel')
// const Brakeshoe = require('../models/brakeshoeModel')
// const Discpad = require('../models/discpadModel')
// const Mobilfilter = require('../models/mobilFilterModel')

const dbCollectionList ={
    "SKR":"shockerModel",
    "BSH":"brakeshoeModel",
    "DPD":"discpadModel",
    "MOF":"mobilfilterModel",
    "RSR":"ballracerModel",
    "BDX":"bendexModel",
    "FTR":"footrestModel",
    "ARF":"airfilterModel",
    "SSN":"sidestandModel",
    "MSN":"mainstandModel"
}

// @desc   Get All Products
// @route  POST /api/prod/:itemCode
// @access Public
const getAllProd = asyncHandler(async (req,res)=>{
    var prod, dbCollection 
    const { itemCode, saveFile } = req.params

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase())){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }
    
    //Checking if we want to create Local CSV file or not
    // if(saveFile==="true"){
    //     prod = await dbCollection.find().lean()
    //     createMongoDataBackup(prod, itemCode.toUpperCase())
    // }else{
        prod = await dbCollection?.find()

    // }
    res.status(200).json(prod)
})


// @desc   Get Specific SKU Product
// @route  GET /api/prod/findSKU
// @access Public
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
// @route  PATCH /api/prod/:sku
// @access Private
const updateProd = asyncHandler(async (req,res)=>{
    var dbCollection, jsonList=[]
    jsonList.push(req.body)
    const cleanedJSON = cleanJsonData(jsonList)[0]

    const sku = req.params.sku
    const itemCode = sku.split('-')[0]

    const prod = {$set: cleanedJSON}

    //options not working, replacing whole Mongoose object
    const options = {upsert: true}

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }

    const result = await dbCollection.updateOne({sku:sku}, prod,{upsert: true})
    // console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`)

    res.status(200).json({message:`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
})

// @desc   Delete specific Product
// @route  DELETE /api/prod/:sku
// @access Private
const deleteProd = asyncHandler(async (req,res)=>{
    var prod, dbCollection
    const sku = req.params.sku
    const itemCode = sku.split('-')[0]

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        throw new Error('Specify Collection in body')
    }

    //Finding if Product exists
    prod = await dbCollection.find({sku:sku})

    if(!prod){
        res.status(400)
        throw new Error('Product not found')
    }

    const result = await dbCollection.findOneAndRemove({sku:sku})

    res.status(200).json({message:`Deleted ${result.sku}`})
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
    getSKUProd,
    setProd,
    setManyProd,
    updateProd,
    deleteProd,
    deleteAllProd,
}