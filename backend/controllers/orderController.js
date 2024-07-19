const asyncHandler = require('express-async-handler')
const fs = require("fs")

const { generateTicket, generateSKUforIncompleteData } = require("../helper/orderHelper")
const { paginateData } = require('../helper/paginationHelper')

const { endOfDay } = require('date-fns/endOfDay')
const { startOfDay } = require('date-fns/startOfDay')

const Demandslip = require("../models/demandslipModel")
const DemandslipHistory = require('../models/demandslipHistoryModel')
const User = require("../models/userModel")
const Products = require('../models/productsModel')


// @desc   Create a new Demand Slip
// @route  POST /api/order/
// @access Private
const createNewDemandSlip = asyncHandler(async (req,res)=>{
    const {deliveryPartnerName,
           distributorName,
           orderedProductList,
           dataStatus
        } = req.body
    
    const { username } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }

    const employeeId = employeeExists._id

    if(!employeeId || !deliveryPartnerName || !distributorName ||
        !orderedProductList || !dataStatus || 
        !orderedProductList.length || !Array.isArray(orderedProductList)){
            res.status(400)
            throw new Error(`All fields are required`)
    }
    
    if(!(dataStatus==="incomplete" || dataStatus==="complete")){
            res.status(400)
            throw new Error(`Incorrect Data Status`)
    }
        
    const { ticketNumber, date } = await generateTicket()
    // console.log(`orderController`)

    const newDemandSlip = {
        ticketNumber,
        employeeId,
        username: employeeExists.username,
        deliveryPartnerName,
        distributorName,
        dataStatus,
        orderedProductList,
    }

    const clientDemandSlip = {
        ticketNumber,
        date,
        employeeId,
        username: employeeExists.username,
        deliveryPartnerName,
        distributorName,
        dataStatus,
        orderedProductList,
    }
    
    const demandSlip = await Demandslip.create(newDemandSlip)
    const demandHistory =  await DemandslipHistory.create(newDemandSlip)

    if(demandSlip && demandHistory){
        res.status(201).json({demandSlipData: clientDemandSlip})
    }else{
        res.status(400)
        throw new Error(`Failure`)
    }
})

// @desc   Get all Demand Slips
// @route  GET /api/order/
// @access Private
const getAllDemandSlips =asyncHandler(async(req,res)=>{
    const { username, roles } = req

    const currPage = parseInt(req.query.page) || 1
    const recordLimit = parseInt(req.query.limit) || 50
    
    const firstIndex = (currPage-1)*recordLimit
    const lastIndex = currPage*recordLimit
    
    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }

    // Check for Manager status
    if(!roles.includes("Manager")){
        res.status(403)
        throw new Error("Forbidden: Manager and above Access Level required")
    }


    // orders = await Demandslip?.find().lean()
    const docCount = await Demandslip?.find().countDocuments()
    orders = await Demandslip?.find()
                            .skip(firstIndex)
                            .limit(recordLimit)
                            .lean().exec()
    
    const pageCount = Math.ceil(docCount / recordLimit)
    
    if(currPage>pageCount){
        res.status(404)
        throw new Error('Page not Found')
    }

    const paginatedOrders = 
        paginateData(orders, docCount, currPage, recordLimit,
            pageCount, firstIndex, lastIndex)

    // res.status(200).json(results)
    res.status(200).json(paginatedOrders)
})

// @desc   Get date filtered Demand Slips
// @route  GET /api/order/filter
// @access Private
const getFilteredDemandSlips = asyncHandler(async(req,res)=>{
    const { date, 
            endDate,
            publisherUsername, 
            status, 
            ticketNum,
            dataStatus    
        } = req.query
    
    const currentDate = new Date();

    let todayDate = currentDate.getDate();
    let todayMonth = currentDate.getMonth() + 1;
    let todayYear = currentDate.getFullYear();

    if(todayDate<10){
        todayDate = `0${todayDate}`
    }
    
    if(todayMonth<10){
        todayMonth = `0${todayMonth}`
    }

    const fullCurrentDateString = todayYear+'-'+todayMonth+'-'+todayDate
    const fullCurrentDate = new Date(fullCurrentDateString)

    const fullCurrentDateClean = todayYear+todayMonth+todayDate

    // let weekAgoDate = new Date(fullCurrentDate - 7 * 24 * 60 * 60 * 1000)
    // console.log(`week ago date: ${weekAgoDate}`)
    
    const currPage = parseInt(req.query.page) || 1
    const recordLimit = parseInt(req.query.limit) || 50

    const firstIndex = (currPage-1)*recordLimit
    const lastIndex = currPage*recordLimit

    const { username, roles } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }
    
    var orders, docCount, pageCount

    if( status && !(status==="pending" || status==="fulfilled" 
        || status==="failed" || status==="partial")
        ){
            res.status(400)
            throw new Error('Bad Request: Invalid DemandSlip Status')
    }
    if( dataStatus & !(dataStatus==="incomplete" || dataStatus==="complete") ){
        res.status(400)
        throw new Error('Bad Request: Invalid DemandSlip Data Status')
    }

    // Employee Level Access
    if(!roles?.length || !Array.isArray(roles) ||
        !roles.includes("Accountant")){

            // Employee Level Access
            let searchParams = []

            // Params based search string
            if(status){
                searchParams=[{status:status}, ...searchParams]
            }
            if(dataStatus){
                searchParams=[{dataStatus:dataStatus},...searchParams]
            }
            if(ticketNum){
                searchParams=[{ticketNumber:{ $regex:ticketNum}},
                    ...searchParams]
            }

            // Find all incase of no search params
            if(searchParams.length!==0){
                docCount = await Demandslip.find({$and: [
                            ...searchParams,
                            {ticketNumber:{ $regex:fullCurrentDateClean}},
                            {username:username},
                            {employeeId: employeeExists._id.toString()},
                            ]
                            })
                        .countDocuments()
                
                orders = await Demandslip.find({$and: [
                                ...searchParams,
                                {ticketNumber:{ $regex:date}},
                                {username:username},
                                {employeeId: employeeExists._id.toString()},
                            ]
                            },
                        '-_id -__v -employeeId -createdAt -updatedAt')
                        .skip(firstIndex)
                        .limit(recordLimit)
                        .lean().exec()
            }
            // Parameterized search
            else{
                docCount = await Demandslip.find({
                                username:username,
                                employeeId: employeeExists._id.toString(),
                                ticketNumber:{ $regex: date}
                            
                        }).countDocuments()

                orders = await Demandslip.find({
                        username:username,
                        employeeId: employeeExists._id.toString(),
                        ticketNumber:{ $regex: date}
                    
                        },'-_id -__v -employeeId -createdAt -updatedAt')
                        .skip(firstIndex)
                        .limit(recordLimit)
                        .lean().exec()
            }
        
        }else if(roles.includes("Accountant") && !roles.includes("Manager")){
            // Accountant Level Access
            let searchParams = []
            let weekAgoDate = new Date(fullCurrentDate - 7 * 24 * 60 * 60 * 1000)

            // Maximum Date Range for Accountant is 7days from today
            searchParams = [
                {createdAt:{$gte:startOfDay(weekAgoDate)}},
                {createdAt:{$lte:endOfDay(fullCurrentDate)}}
            ]

            // Params based search string
            if(date && !endDate){
                let fromDateString = date.slice(4)+
                                    '-'+date.slice(2,4)+
                                    '-'+date.slice(0,2)
                let fromDate = new Date(fromDateString) 
                
                if(fromDate < weekAgoDate){
                    searchParams=[
                        {createdAt:{$gte:startOfDay(weekAgoDate)}},
                        {createdAt:{$lte:endOfDay(weekAgoDate)}},
                    ]
                    // res.status(400)
                    // throw new Error('Bad Request: Date Range Greater than 7 days')
                }else{
                    searchParams=[{ticketNumber:{ $regex:date}}, ...searchParams]
                }
            }
            if(date && endDate){
                let fromDateString = date.slice(4)+
                                    '-'+date.slice(2,4)+
                                    '-'+date.slice(0,2) 
                let toDateString = endDate.slice(4)+
                                    '-'+endDate.slice(2,4)+
                                    '-'+endDate.slice(0,2)
                let fromDate = new Date(fromDateString) 
                let toDate = new Date(toDateString) 

                if(fromDate < weekAgoDate && !(toDate>fullCurrentDate)){
                    searchParams=[
                        {createdAt:{$gte:startOfDay(weekAgoDate)}},
                        {createdAt:{$lte:endOfDay(toDate)}},
                    ]
                    // res.status(400)
                    // throw new Error('Bad Request: Date Range Greater than 7 days')
                }else if(toDate>fullCurrentDate && !(fromDate<weekAgoDate)){
                    searchParams=[
                        {createdAt:{$gte:startOfDay(fromDate)}},
                        {createdAt:{$lte:endOfDay(fullCurrentDate)}},
                    ]
                    // res.status(400)
                    // throw new Error('Bad Request: End Date Greater than Today')
                }else if(fromDate < weekAgoDate && toDate>fullCurrentDate){
                    searchParams=[...searchParams]
                }else{
                    searchParams=[
                        {createdAt:{$gte:startOfDay(fromDate)}},
                        {createdAt:{$lte:endOfDay(toDate)}},
                    ]
                }

            }
            if(status){
                searchParams=[{status:status}, ...searchParams]
            }
            if(dataStatus){
                searchParams=[{dataStatus:dataStatus}, ...searchParams]
            }
            if(publisherUsername){
                searchParams = [{username:publisherUsername}, ...searchParams]
            }
            if(ticketNum){
                searchParams=[{ticketNumber:{ $regex:ticketNum}},
                    ...searchParams]
            }

            // Parameterized search
            docCount = await Demandslip.find({$and: searchParams})
                                    .countDocuments()

            orders = await Demandslip.find({$and: searchParams}
                                    ,'-_id -__v')
                                    .skip(firstIndex)
                                    .limit(recordLimit)
                                    .lean().exec()

        }else{
            // Manager and Admin Level Access
                let searchParams = []

                // Params based search string
                if(date && !endDate){
                    searchParams=[{ticketNumber:{ $regex:date}}, ...searchParams]
                }
                if(date && endDate){
                    let fromDateString = date.slice(4)+
                                    '-'+date.slice(2,4)+
                                    '-'+date.slice(0,2)
                    let toDateString = endDate.slice(4)+
                                    '-'+endDate.slice(2,4)+
                                    '-'+endDate.slice(0,2)
                    let fromDate = new Date(fromDateString)
                    let toDate = new Date(toDateString) 
                    
                    // console.log(`fD:${startOfDay(fromDate)}`)
                    // console.log(`tD:${endOfDay(toDate)}`)
                    // .toISOString()
                    searchParams=[
                        {createdAt:{$gte:startOfDay(fromDate)}},
                        {createdAt:{$lte:endOfDay(toDate)}},
                    ]
                }
                if(status){
                    searchParams=[{status:status}, ...searchParams]
                }
                if(dataStatus){
                    searchParams=[{dataStatus:dataStatus}, ...searchParams]
                }
                if(publisherUsername){
                    searchParams = [{username:publisherUsername}, ...searchParams]
                }
                if(ticketNum ){
                    searchParams=[{ticketNumber:{ $regex:ticketNum}},
                        ...searchParams]
                }

                // Find all incase of no search params
                if(!date && !status && !publisherUsername && !ticketNum & !dataStatus){
                    docCount = await Demandslip?.find().countDocuments()

                    orders = await Demandslip?.find({}
                                        ,'-id -__v')
                                        .skip(firstIndex)
                                        .limit(recordLimit)
                                        .lean().exec()
                }
                // Parameterized search
                else{
                    docCount = await Demandslip.find({$and: searchParams})
                                            .countDocuments()

                    orders = await Demandslip.find({$and: searchParams}
                                            ,'-_id -__v')
                                            .skip(firstIndex)
                                            .limit(recordLimit)
                                            .lean().exec()
                }
    }

    // Paginate Data
    if(docCount){
        pageCount = Math.ceil(docCount / recordLimit)
        
        if(currPage>pageCount){
            res.status(404)
            throw new Error('Page not Found')
        }
    }else{
        let results = {
            totalDataLength:0,
            pageCount:1,
            currentPage:1,
            data: orders
        }
        return res.status(200).json(results)
    }
    
    
    const paginatedOrders = paginateData(orders,docCount, 
        currPage, recordLimit, pageCount, firstIndex, lastIndex)

    res.status(200).json(paginatedOrders)
})

// @desc   Update pending Demand Slip (Admin can update closed tickets)
// @route  PATCH /api/order/:ticketNumber
// @access Private
const updateAfterDelivery = asyncHandler(async(req,res)=>{
    const { status, recievedProductList,totalCost } = req.body
    const { ticketNumber } = req.params

    const { username, roles } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }

    const employeeId = employeeExists._id
    
    const demandSlip = await Demandslip.findOne({ticketNumber:ticketNumber}).exec()

    if(!employeeId || !status || (status!=="failed" && !totalCost)
        ){
        res.status(400)
        throw new Error('All fields are requied')
    }

    // Check for existing ticket
    if(!demandSlip){
        res.status(400)
        throw new Error("Demand Slip not found")
    }

    // Check if ticket status is pending or if Different User has Admin access
    if((demandSlip.status!=="pending" && !roles.includes("Admin")) 
        || 
        (employeeId.toString()!==demandSlip.employeeId.toString() 
        && username!==demandSlip.username 
        && !roles.includes("Admin"))){
            res.status(403)
            throw new Error("Forbidden")
    }

    // Status Logic
    if(status === "fulfilled"){
        demandSlip.status = status
        demandSlip.recievedProductList = demandSlip.orderedProductList
        demandSlip.totalCost = totalCost
    }else if (status === "partial"){
        demandSlip.status = status
        demandSlip.recievedProductList = recievedProductList
        demandSlip.totalCost = totalCost
    }else if(status === "failed"){
        demandSlip.status = status
        demandSlip.recievedProductList = []
        demandSlip.totalCost = 0
    }
    const demandBackup = {
        ticketNumber: demandSlip.ticketNumber,
        employeeId,
        username: employeeExists.username,
        deliveryPartnerName: demandSlip.deliveryPartnerName,
        distributorName: demandSlip.distributorName,
        status: demandSlip.status,
        orderedProductList: demandSlip.orderedProductList,
        recievedProductList: demandSlip.recievedProductList,
        totalCost: demandSlip.totalCost
    }

    // Update Quantity of Recieved Products
    // let toUpdateProdList = demandSlip.recievedProductList

    // for(const itemData of toUpdateProdList){ 
    //     let partNumber = itemData.sku.split("-")[3]
    //     console.log(`pN: ${partNumber}`)           
    //     await Products.updateMany({$or:[
    //                                 {sku:itemData.sku},
    //                                 {sku:{$regex:partNumber}}
    //                             ]},
    //         {$inc:{qty:itemData.quantity}},
    //         {upsert:false}
    //     )
    // }

    // res.status(200).json(demandSlip)

    const demandHistory =  await DemandslipHistory.create(demandBackup)
    const updatedDemandslip = await demandSlip.save()

    if(demandHistory){
        res.json({message:`Demand Slip ${updatedDemandslip.ticketNumber} with ${updatedDemandslip.status} status`})
    }else{
        res.status(400)
        throw new Error(`Failure`)
    }
})

// @desc   Update pending Demand Slip (Admin can update closed tickets)
// @route  PATCH /api/order/:ticketNumber
// @access Private
const updateIncompleteOrder = asyncHandler(async(req,res)=>{
    const { orderedProductList, status, totalCost } = req.body
    const { ticketNumber } = req.params

    // Create 7 days logic for Accountant and Manager and infinite for Admin

    const { username, roles } = req
    
    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }

    const employeeId = employeeExists._id
    
    const demandSlip = await Demandslip.findOne({ticketNumber:ticketNumber}).exec()

    if(!employeeId || !status || !totalCost
        ){
        res.status(400)
        throw new Error('Data Missing')
    }

    // Check for existing ticket
    if(!demandSlip){
        res.status(400)
        throw new Error("Demand Slip not found")
    }

    // Check if ticket status is not pending or if Different User has Accountant access
    if(demandSlip.status==="pending" || !roles.includes("Accountant")){
            res.status(403)
            throw new Error("Forbidden: Minimum Accountant Access required or Order Status Pending")
    }

    const updatedOrderList = generateSKUforIncompleteData(orderedProductList)
    
})

// @desc   Delete Demand Slip (Admin access only)
// @route  DELETE /api/order/:ticketNumber
// @access Private
const deleteDemandSlip = asyncHandler(async(req,res)=>{
    const { ticketNumber } = req.params
    const { username, roles } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }

    const employeeId = employeeExists._id

    // Check for Admin status
    if(!roles.includes("Admin")){
        res.status(403)
        throw new Error("Forbidden")
    }

    const demandSlip = await Demandslip.findOne({ticketNumber:ticketNumber}).exec()

    // Check for existing ticket
    if(!demandSlip){
        res.status(400) 
        throw new Error(`Demand Slip ${ticketNumber} not found`)
    }

    const demandBackup = {
        ticketNumber: demandSlip.ticketNumber,
        employeeId: employeeId,
        username: employeeExists.username,
        deliveryPartnerName: demandSlip.deliveryPartnerName,
        distributorName: demandSlip.distributorName,
        status: `deleted by Admin ${username}`,
        orderedProductList: demandSlip.orderedProductList,
        recievedProductList: demandSlip.recievedProductList,
        totalCost: demandSlip.totalCost
    }

    const result = await demandSlip.deleteOne()
    await DemandslipHistory.create(demandBackup)

    const message = `Demand Slip ${result.ticketNumber} deleted by Admin ${username}`

    res.status(200).json({message})
})

// @desc   Delete All Demand Slips (Admin access only)
// @route  DELETE /api/order
// @access Private
const deleteAllDemandSlip = asyncHandler(async(req,res)=>{
    const { username, roles } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }


    // Check for Admin status
    if(!roles?.length || !Array.isArray(roles) ||
        !roles.includes("Admin")){
        res.status(403)
        throw new Error("Forbidden")
    }

    await Demandslip.deleteMany({})
    res.status(200).json({message:`Deleted all orders from Demand Slip Collection`})
})

// @desc   Delete All Demand Slip History (Admin access only)
// @route  DELETE /api/order/reset
// @access Private
const deleteAllDemandHistory = asyncHandler(async(req,res)=>{
    const { username, roles } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }

    // Check for Admin status
    if(!roles?.length || !Array.isArray(roles) ||
        !roles.includes("Admin")){
        res.status(403)
        throw new Error("Forbidden")
    }

    await DemandslipHistory.deleteMany({})
    res.status(200).json({message:`Deleted all orders from Demand History Collection`})
})



module.exports={
    createNewDemandSlip,
    getAllDemandSlips,
    getFilteredDemandSlips,
    updateAfterDelivery,
    deleteAllDemandSlip,
    deleteAllDemandHistory,
    deleteDemandSlip
}