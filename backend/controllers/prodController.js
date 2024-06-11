const asyncHandler = require('express-async-handler')
const {cleanJsonData, localCSVtoJSON, createMongoDataBackup, cleanItemCodeJsonData } = require("../helper/prodHelper")

// const Shocker = require('../models/shockerModel')
// const Brakeshoe = require('../models/brakeshoeModel')
// const Discpad = require('../models/discpadModel')
// const Mobilfilter = require('../models/mobilFilterModel')
const Products = require('../models/productsModel')
const ItemCodeIndex = require('../models/itemCodeIndexModel')
const axios = require('axios')

const dbCollectionList ={
    // "ALL":"productsModel",
    // "ICI":"itemCodeIndexModel",
    "ACC":"acceleratorcableModel",
    "ARF":"airfilterModel",
    "RSR":"ballracerModel",
    "BDX":"bendexModel",
    "BSH":"brakeshoeModel",
    "CCC":"clutchcableModel",
    "CDI":"cdiModel",
    "CFA":"clutchassemblyModel",
    "CMA":"camshaftModel",
    "DPD":"discpadModel",
    "FTR":"footrestModel",
    "MSN":"mainstandModel",
    "MOF":"mobilfilterModel",
    "RKR":"rockerModel",
    "RVM":"mirrorModel",
    "SFR":"selfcutModel",
    "SKR":"shockerModel",
    "SSN":"sidestandModel",
    "TCH":"timingchainModel",
    "TCT":"timingchainadjusterModel",
    "SPK":"chainsprocketkitModel",
    "CLP":"caliperModel",
    "CRB":"carburetorModel",
    "TCP":"timingchainpadModel",
    "VSG":"visorglassModel",
    "CFP":"clutchPlateModel",
    "LKT":'lockkitModel',
    "SMC":"metercableModel",
    "RHS":"righthandswitchModel",
    "ARM":"armatureModel",
    "BLN":"balancerModel",
    "BLT":"beltModel",
    "BPA":"cylinderkitModel",
    "BLV":"brakeleverModel",

    "BPL":"brakepedalModel",
    "CNA":"chainadjusterModel",
    "CHS":"chassisModel",
    "CCN":"clutchcenterModel",
    "CGP":"clutchgasketpackingModel",

    "CHB":"clutchhubModel",
    "CLV":"clutchleverModel",
    "CPA":"clutchpulleyModel",
    "CWT":"clutchshoeModel",
    "CSW":"clutchswitchModel",
    
    "CYK":"clutchyokeModel",
    "CON":"condensorModel",
    "KPH":"couplinghubModel",
    "CRA":"crankassemblyModel",
    "DLV":"discleverModel",
   
    "DSP":"discplateModel",
    "DYK":"discyokeModel",
    "DRB":"drumrubberModel",
    "DRM":"drumModel",
    "TGR":"facedriveModel",

    "FLS":"flasherModel",
    "RRD":"footrestrodModel",
    "FAS":"forkassemblyModel",
    "FBL":"forkballModel",
    "BRL":"forkbarrelModel",

    "FOS":"forkoilsealModel",
    "FRD":"forkrodModel",
    "FSW":"frontstopswitchModel",
    "FPT":"fuelpetroltapModel",
    "FTC":"fueltankcapModel",
    
    "GBS":"gearboxsprocketModel",
    "GLV":"gearleverModel",
    "GPD":"gearpiniondriveModel",
    "GSF":"gearshaftModel",
    "GRP":"gripModel",

    "HKT":"halfpackingkitModel",
    "HND":"handleModel",
    "HLA":"headlightassemblyModel",
    "HDO":"headoringModel",
    "HTC":"htcoilModel",
    
    "KKR":"kickpedalModel",
    "KSF":"kickshaftModel",
    "LST":"leversetModel",
    "MGP":"magnetpackingModel",
    "MSP":"mainstandpinModel",

    "MCA":"mastercylinderassemblyModel",
    "SMA":"meterassemblyModel",
    "SMD":"meterdriveModel",
    "SMP":"meterpinionModel",
    "SMS":"metersensorModel",

    "OPM":"oilpumpModel",
    "OWY":"onewayModel",
    "PKT":"packingkitModel",
    "PCL":"pickupcoilModel",
    "PLC":"plugcapModel",

    "PLS":"plugsocketModel",
    "RSW":"rearstopswitchModel",
    "RIM":"rimModel",
    "RLR":"rollerkitModel",
    "SSM":"selfstartmotorModel",

    "SAS":"suspensionModel",
    "TLA":"taillightassemblyModel",
    "TEE":"teeModel",
    "TKT":"timingchainkitModel",
    "VOS":"valveoilsealModel",

    "VLV":"valveModel",
    "VRT":"variatorModel",
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

// @desc   Get Mongo Data for local Export
// @route  GET /api/prod/exportMongoData/:itemCode
// @access Private
const getDataForExportProd = asyncHandler(async (req,res)=>{
    var prod, dbCollection 
    const { itemCode } = req.params

    // if(itemCode.toUpperCase()==="ALL"){
    //     prod = await dbCollection?.find().lean()

    //     createMongoDataBackup(prod,itemCode.toUpperCase())
    // }else{

        // Finding right Collection
        const dbKeys = Object.keys(dbCollectionList)
        if(dbKeys.includes(itemCode.toUpperCase())){
            dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
        }else{
            res.status(400)
            throw new Error('Specify Collection')
        }
        
        prod = await dbCollection?.find().lean()
        createMongoDataBackup(prod,itemCode.toUpperCase())
    // }
        

    res.status(200).json(prod)
})

// @desc   Get Product Name from Item Code 
// @route  GET /api/index/:itemCode
// @access Public
const getItemCodeIndex = asyncHandler(async(req,res)=>{
    const { itemCode } = req.params
    
    const prodName = await ItemCodeIndex
                                .findOne({
                                    itemCode:itemCode.toUpperCase()
                                    },'-_id -__v')
                                .lean()

    if(!prodName){
        res.status(404)
        throw new Error('Invalid Item Code')
    }

    res.status(200).json(prodName)
})

// @desc   Set Product Name from Item Code 
// @route  SET /api/prod/index/:itemCode
// @access Public
const setItemCodeIndex =asyncHandler(async(req,res)=>{
    // const { itemCode } = req.params 
    // const { productName } = req.body

    const { rewrite } = req.query
    
    const { roles } = req

    if(!roles.includes("Admin")){
        res.status(403)
        throw new Error("Forbidden")
    }

    const localJson = localCSVtoJSON("ICI")

    const cleanedJSON = cleanItemCodeJsonData(localJson)

    if(rewrite==="true"){
        await ItemCodeIndex.deleteMany({})
        
        await ItemCodeIndex.insertMany(cleanedJSON,{ordered:true} )
        
        res.status(200).json(cleanedJSON)
    }else{
        const existingData = await ItemCodeIndex.find()
                                                .select('itemCode productName -_id')
                                                .lean()
        let existingDataSet = new Set()
        let newDataSet = new Set()

        cleanedJSON.forEach((itemData)=>{
            newDataSet.add(itemData.itemCode)
        })

        existingData.forEach((itemData)=>{
            existingDataSet.add(itemData.itemCode)
        })

        let toAddDataSet = new Set(
            [...newDataSet].filter(x => !existingDataSet.has(x)));

        let toAddData = []

        for (const item of toAddDataSet) {
            let itemToBeAdded = cleanedJSON.filter((x)=>x.itemCode===item)
            toAddData.push(itemToBeAdded[0])    
        }
        
        await ItemCodeIndex.insertMany(toAddData,{ordered:true} )

        res.status(200).json({message:`Added ${toAddData.length} new item indexes`})
    }
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
// @route  POST /api/prod/search/sku/:skuOnlyFlag
// @access Public
const getSKUProd = asyncHandler(async (req,res)=>{
    const iC = req.body.itemCode? req.body.itemCode.toUpperCase() : ""
    
    const cleanedVM = req.body.vehicleModel? req.body.vehicleModel.toUpperCase() : ""
    // const vM = cleanedVM.replace(/-/g,"")
    const vM = cleanedVM.replace(/-/g," ")
    const vMKeywordList = cleanedVM.split(" ")
    
    const bC = req.body.brandCompany? req.body.brandCompany.toUpperCase() : ""
    // const 

    // const spaceRemovedPN = req.body.partNum? req.body.partNum.replace(/ /g,"") : ""
    // const cleanedPN = spaceRemovedPN.replace(/-/g,"") 
    const pN = req.body.partNum?req.body.partNum.toUpperCase():""
    const cleanedPN = pN.replace(/-/g,"") 
    const pNKeywordList = cleanedPN.split(" ")

    const { skuOnlyFlag } = req.params

    let prod, dbCollection
    let searchParams = [
        // {sku: { $regex: iC}},
    ]

    // Defining Fields to be searched based on input
    if(vM!==""){
        let vMsearchParams = vMKeywordList.map((keyWord=>{
            return {vehicleModel:{$regex:keyWord}}
        }))

        searchParams = [{
            $or:[
                {sku:{$regex:vM}},
                {
                    $and:[
                    ...vMsearchParams
                    ]
                }
            ]
        },
            ...searchParams
        ]
    }

    if(bC!==""){
        searchParams = [{
            $or:[
                {sku: { $regex: bC}},
                {brandCompany:{$regex:bC}}, 
            ]
        },
            ...searchParams
        ]
    }

    if(pN!==""){
        let pNsearchParams = pNKeywordList.map((keyWord=>{
            return {partNum:{$regex:keyWord}}
        }))

        let spaceRemovedPN = cleanedPN.replace(/ /g,"")


        searchParams = [{
            $or:[
                {sku:{$regex:spaceRemovedPN.replace(/ /g,"")}},
                {
                    $and:[
                    ...pNsearchParams
                    ]
                }
            ]
        },
            ...searchParams
        ]

        // searchParams = [{
        //     $or:[
        //         {sku: { $regex: pN}},
        //         {partNum:{$regex:pN}}, 
        //     ]
        // },
        //     ...searchParams
        // ]
    }

    if(searchParams.length===0){
        searchParams=[
            {sku:{$regex:iC}}
        ]
    }

    // Finding right Collection
    const dbKeys = Object.keys(dbCollectionList)
    if(dbKeys.includes(iC)){
        dbCollection = require(`../models/${dbCollectionList[req.body.itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }

    if(skuOnlyFlag==="true"){
        prod = await dbCollection.find({ $and:[
            ...searchParams
        ]})
        .select('sku itemCode productName vehicleModel brandCompany partNum metaData -_id')
        .lean()
    }else if(skuOnlyFlag==="false"){
        // console.log(`searchParams:${JSON.stringify(searchParams,null,4)}`)
        prod = await dbCollection.find({ $and:[
            ...searchParams
        ]},{__v:0})
        .lean()
    }


    res.status(200).json(prod)
})

// @desc   Find Products matching key
// @route  GET /api/prod/search/:searchKey
// @access Public
const searchAll = asyncHandler(async(req,res)=>{
    const { testSearch } = req.query
    const searchKey = req.params.searchKey.trim().toUpperCase()

    const searchKeyList  = searchKey.split(" ")
    let searchParams = []

    if(searchKeyList && searchKeyList.length!==0){
        searchParams = searchKeyList.map(keyWord=>{
            return {productFullName:{$regex:keyWord}}
        }) 
    }

    // searchParams = [{
    //     $or:[
    //         {sku:{$regex:searchKey}},
    //         {
    //             $and:[
    //                 ...searchParams
    //             ]
    //         }
    //     ]
    // }]

    // console.log(`sP: ${JSON.stringify(searchParams,null,4)}`)

    // if(testSearch==="true"){
        const response = await Products.find({ $or:[
            {sku:{$regex:searchKey}},
            {
                $and:[
                    ...searchParams
                ]
            }
        ]})

        res.status(200).json(response) 
    // }else{
    //     const response = await Products.find({$or:[
    //                     {itemCode:{$regex: searchKey}},
    //                     {productName:{$regex: searchKey}},
    //                     {vehicleModel:{$regex: searchKey}},
    //                     {brandCompany:{$regex: searchKey}},
    //                     {partNum:{$regex: searchKey}},
    //                     {sku:{$regex: searchKey}},
    //                     ]})
    //                     .lean()
    // // .select('sku -_id')

    // res.status(200).json(response)
    // }
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
    console.log(`localCSVtoJSON length:${localJson.length}`)
    
    const cleanedJSON = cleanJsonData(localJson)
    console.log(`cleanedJSON length:${cleanedJSON.length}`)

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

// @desc   Update specific Product
// @route  PATCH /api/prod/:sku
// @access Private
const addNewFields = asyncHandler(async (req,res)=>{
    const { roles } = req
    const { itemCode } = req.params

    if(!roles.includes("Admin")){
        res.status(403)
        throw new Error("Forbidden")
    }

    let dbCollection
    const dbKeys = Object.keys(dbCollectionList)

    
    // for(const iCode in dbCollectionList){
        // Finding right Collection
    if(dbKeys.includes(itemCode.toUpperCase() )){
        dbCollection = require(`../models/${dbCollectionList[itemCode.toUpperCase()]}`) 
    }else{
        res.status(400)
        throw new Error('Specify Collection')
    }
        
        await dbCollection.aggregate([
            {
                $project:{
                    _id:"$_id",
                qty:{$toInt:"$qty"},
                }
            },
            {
                $merge:{
                    into:dbCollection.collection.collectionName,
                on:"_id"
                }
            }
        ])
    // }
                        
                        // const results = await dbCollection.updateMany({}, 
                        // unit:"PC"
                        // productFullName:{$concat:[
                        //                     "$productName"," ",
                        //                     "$vehicleModel"," ",
                        //                     "$brandCompany"," ",
                        //                     "$partNum"
                        //                 ]},

    res.status(200).json({message:`Updated All in List`})
})


// const addNewFieldsBatch = asyncHandler(async (req,res)=>{
//     const { roles } = req

//     if(!roles.includes("Admin")){
//         res.status(403)
//         throw new Error("Forbidden")
//     }

//     const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

//     async function asyncForEach(array, callback) {
//         for (let index = 0; index < array.length; index++) {
//           await callback(array[index], index, array);
//         }
//       }

//     const keysList = Object.keys(testCollectionMap)

//     const start = async () => {
//     await asyncForEach(keysList, async (itemData) => {
//         await axios.put(`http://localhost:5000/api/prod/addNewField/`+`${itemData}`);
//         console.log(itemData);
//     });
//     console.log(`Done`);
//     }
//     start();

//     res.status(200).json(keysList)
// })

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
    if(dbKeys.includes( itemCode.toUpperCase() )){
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
    getDataForExportProd,
    getSKUProd,
    getItemCodeIndex,
    setItemCodeIndex,
    pushToProduct,
    searchAll,
    setProd,
    setManyProd,
    updateProd,
    deleteProd,
    deleteAllProd,
    addNewFields,
    // addNewFieldsBatch,
}