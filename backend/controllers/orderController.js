const asyncHandler = require('express-async-handler')
const { generateTicket } = require("../helper/orderHelper")
const fs = require("fs")

const Demandslip = require("../models/demandslipModel")
const DemandslipHistory = require('../models/demandslipHistoryModel')
const User = require("../models/userModel")
const { paginateData } = require('../helper/paginationHelper')

// @desc   Create a new Demand Slip
// @route  POST /api/order/
// @access Private
const createNewDemandSlip = asyncHandler(async (req,res)=>{
    const {deliveryPartnerName,
           distributorName,
           orderedProductList } = req.body
    
    const { username } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }

    const employeeId = employeeExists._id

    if(!employeeId || !deliveryPartnerName || !distributorName ||
        !orderedProductList ||
        !orderedProductList.length || !Array.isArray(orderedProductList)){
            res.status(400)
            throw new Error(`All fields are required`)
        }
    
    const { ticketNumber, date } = await generateTicket()
    
    
    const newDemandSlip = {
        ticketNumber,
        employeeId,
        username: employeeExists.username,
        deliveryPartnerName,
        distributorName,
        orderedProductList,
    }

    const clientDemandSlip = {
        ticketNumber,
        date,
        employeeId,
        username: employeeExists.username,
        deliveryPartnerName,
        distributorName,
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

    orders = await Demandslip?.find().lean()
    const paginatedOrders = paginateData(orders, currPage, recordLimit)
    
    // res.status(200).json(orders)
    res.status(200).json(paginatedOrders)
})

// @desc   Get date filtered Demand Slips
// @route  POST /api/order/filter/:date
// @route  GET /api/order/filter
// @access Private
const getFilteredDemandSlips = asyncHandler(async(req,res)=>{
    const { date, 
            publisherUsername, 
            status, 
            ticketNum    
        } = req.query
    
    const currPage = parseInt(req.query.page) || 1
    const recordLimit = parseInt(req.query.limit) || 50

    // console.log(`cP:${currPage}\nrL:${recordLimit}`)

    const { username, roles } = req

    const employeeExists = await User.findOne({username}).select('-password').lean()

    // Check if User exists and Active
    if(!employeeExists || !employeeExists.active){
        res.status(403)
        throw new Error('Unauthorized')
    }

    // const employeeId = employeeExists._id
    
    var orders

    if( status && !(status==="pending" || status==="fulfilled" 
        || status==="failed" || status==="partial")
        ){
            res.status(400)
            throw new Error('Bad Request: Invalid DemandSlip Status')
    }

    // Check for minimum Managaer Level Access
    if(!roles?.length || !Array.isArray(roles) ||
        !roles.includes("Manager")){

            // Employee Level Access
            let searchParams = []

            // Params based search string
            if(status){
                searchParams=[{status:status}, ...searchParams]
            }
            if(ticketNum ){
                searchParams=[{ticketNumber:{ $regex:ticketNum}},
                    ...searchParams]
            }

            // Find all incase of no search params
            if(searchParams.length!==0){
                orders = await Demandslip.find({$and: [
                            ...searchParams,
                            {ticketNumber:{ $regex:date}},
                            {username:username},
                            {employeeId: employeeExists._id.toString()},
                        ]
                },
                    '-_id -__v -employeeId -createdAt -updatedAt').lean()
            }
            // Parameterized search
            else{
                orders = await Demandslip.find({
                        username:username,
                        employeeId: employeeExists._id.toString(),
                        ticketNumber:{ $regex: date}
                    
                },'-_id -__v -employeeId -createdAt -updatedAt').lean()
            }
        
        }else{
            // Manager and Admin Level Access
                let searchParams = []

                // Params based search string
                if(date){
                    searchParams=[{ticketNumber:{ $regex:date}}, ...searchParams]
                }
                if(status){
                    searchParams=[{status:status}, ...searchParams]
                }
                if(publisherUsername){
                    searchParams = [{username:publisherUsername}, ...searchParams]
                }
                if(ticketNum ){
                    searchParams=[{ticketNumber:{ $regex:ticketNum}},
                        ...searchParams]
                }

                // Find all incase of no search params
                if(!date && !status && !publisherUsername && !ticketNum){
                    orders = await Demandslip?.find({}
                                                ,'-id -__v').lean()
                }
                // Parameterized search
                else{
                    orders = await Demandslip.find({$and: searchParams}
                                                ,'-_id -__v').lean()
                }
    }

    const paginatedOrders = paginateData(orders, currPage, recordLimit)

    // res.status(200).json(orders) 
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

    const demandHistory =  await DemandslipHistory.create(demandBackup)
    const updatedDemandslip = await demandSlip.save()

    if(demandHistory){
        res.json({message:`Demand Slip ${updatedDemandslip.ticketNumber} with ${updatedDemandslip.status} status`})
    }else{
        res.status(400)
        throw new Error(`Failure`)
    }
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