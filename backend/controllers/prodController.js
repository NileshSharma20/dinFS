const asyncHandler = require('express-async-handler')
const {cleanJsonData, localCSVtoJSON } = require("../helper/prodHelper")

// const Shocker = require('../models/shockerModel')
// const Brakeshoe = require('../models/brakeshoeModel')
// const Discpad = require('../models/discpadModel')
// const Mobilfilter = require('../models/mobilFilterModel')
const Products = require('../models/productsModel')

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
// @route  GET /api/prod/:itemCode
// @access Public
const getAllProd = asyncHandler(async (req,res)=>{
    var prod, dbCollection 
    const { itemCode } = req.params

    // Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase())){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }
    
    prod = await dbCollection?.find().lean()

    res.status(200).json(prod)
})

// @desc   Push to Products Collection 
// @route  POST /api/prod/
// @access Public
const pushToProduct = asyncHandler(async (req,res)=>{
    var prod, dbCollection 
    const { itemCode } = req.body

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase())){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }
    
    prod = await dbCollection?.find().lean()

    // if(pushProd){
    const options = { ordered: true };
    await Products.insertMany(prod, options);
    // }

    res.status(200).json(prod)
})


// @desc   Find Specific SKU Product
// @route  POST /api/prod/search/sku
// @access Public
const getSKUProd = asyncHandler(async (req,res)=>{
    const iC = req.body.itemCode?req.body.itemCode.toUpperCase():""
    const cleanedVM = req.body.vehicleModel?req.body.vehicleModel.toUpperCase():""
    const vM = cleanedVM.replace(/-/g,"")
    const bC = req.body.brandCompany?req.body.brandCompany.toUpperCase():""
    const spaceRemovedPN = req.body.partNum?req.body.partNum.replace(/ /g,""):""
    const cleanedPN = spaceRemovedPN.replace(/-/g,"") 
    const pN = cleanedPN.toUpperCase()

    let prod, dbCollection

    // Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(iC)){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }

    prod = await dbCollection.find({ $and:[
        {sku: { $regex: iC}}, 
        {sku: { $regex: vM}}, 
        {sku: { $regex: bC}}, 
        {sku: { $regex: pN}}
    ]},{__v:0}).lean()

    res.status(200).json(prod)
})

// @desc   Find Products matching key
// @route  GET /api/prod/search/:searchKey
// @access Public
const searchAll = asyncHandler(async(req,res)=>{
    const searchKey = req.params.searchKey.toUpperCase()

    const response = await Products.find({$or:[
        {itemCode:{$regex: searchKey}},
        {vehicleModel:{$regex: searchKey}},
        {brandCompany:{$regex: searchKey}},
        {partNum:{$regex: searchKey}},
        {sku:{$regex: searchKey}},
    ]})
    .lean()
    // .select('sku -_id')

    // if(response.length===0){
    //     res.status(204)
    //     throw new Error('No Content')
    // }
    
    res.status(200).json(response)
})

// @desc   Set Product 
// @route  POST /api/prod/upload
// @access Private
const setProd = asyncHandler(async (req,res)=>{
    // Checking for Missing Feilds
    if(!req.body.itemCode || !req.body.vehicleModel || !req.body.brandCompany ||
        !req.body.partNum || !req.body.mrp){
        res.status(400)
        throw new Error('Please fill all essential fields')
    }

    // Converting and Cleaning to useful data
    const cleanedObj = cleanJsonData([req.body])

    let prod, dbCollection

    // Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(req.body.itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }

    // Checking for Existing Products
    const duplicate = await dbCollection.findOne({sku:cleanedObj[0].sku})
    const prodDuplicate = await dbCollection.findOne({sku:cleanedObj[0].sku})

    if(duplicate || prodDuplicate){
        res.status(409)
        throw new Error(`Product Already Exists`)
    }

    prod = await dbCollection.create(cleanedObj)
    await Products.create(cleanedObj)

    res.status(200).json(prod)
})



// @desc   Set Multiple Products
// @route  POST /api/prod/upload/multiple
// @access Private
const setManyProd = asyncHandler(async (req,res)=>{
    const { itemCode } = req.body
    const localJson = localCSVtoJSON(itemCode.toUpperCase())

    const cleanedJSON = cleanJsonData(localJson)

    const options = { ordered: true };

    let result, dbCollection
    
    // Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }

    result = await dbCollection.insertMany(cleanedJSON, options);
    await Products.insertMany(cleanedJSON, options);

    res.status(200).json({message: `${result.length} documents were inserted.`})
})

// @desc   Update specific Product
// @route  PATCH /api/prod/:sku
// @access Private
const updateProd = asyncHandler(async (req,res)=>{
    const { roles } = req

    if(!roles.includes("Admin")){
        res.status(403)
        throw new Error("Forbidden")
    }

    let dbCollection, jsonList=[]
    jsonList.push(req.body)
    const cleanedJSON = cleanJsonData(jsonList)[0]

    const sku = req.params.sku
    const itemCode = sku.split('-')[0]

    const prod = {$set: cleanedJSON}

    // options not working, replacing whole Mongoose object
    const options = {upsert: true}

    // Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }

    await dbCollection.updateOne({sku:sku}, prod,{upsert: true})
    await Products.updateOne({sku:sku}, prod,{upsert: true})

    res.status(200).json({message:`Updated ${sku}`})
})

// @desc   Delete specific Product
// @route  DELETE /api/prod/:sku
// @access Private
const deleteProd = asyncHandler(async (req,res)=>{
    let prod, dbCollection
    const sku = req.params.sku
    const itemCode = sku.split('-')[0]

    //Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }

    // Checking if Product exists
    prod = await dbCollection.findOne({sku:sku})
    prodAll = await Products.findOne({sku:sku})

    if(!prod && !prodAll){
        res.status(400)
        throw new Error('Product not found')
    }

    const result = await dbCollection.findOneAndRemove({sku:sku})
    const resultProd = await Products.findOneAndRemove({sku:sku})

    res.status(200).json({message:`Deleted ${result?result.sku:resultProd.sku} from all Collections`})
})

// @desc   Delete all Products from a Collection
// @route  DELETE /api/prod/deleteAll
// @access Private
const deleteAllProd = asyncHandler(async (req,res)=>{
    const { itemCode } = req.body
    let dbCollection

    // Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }

    await dbCollection.deleteMany({})
    await Products.deleteMany({itemCode:itemCode.toUpperCase()})

    res.status(200).json({message:`Deleted all products from all Collection`})
})

module.exports = {
    getAllProd,
    getSKUProd,
    pushToProduct,
    searchAll,
    setProd,
    setManyProd,
    updateProd,
    deleteProd,
    deleteAllProd,
}