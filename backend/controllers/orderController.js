const asyncHandler = require('express-async-handler')
const { generateTicket, generateDemandReciept } = require("../helper/orderHelper")
const fs = require("fs")

const Demandslip = require("../models/demandslipModel")
const DemandslipHistory = require('../models/demandslipHistoryModel')
const User = require("../models/userModel")

// @desc   Create a new Demand Slip
// @route  POST /api/order/
// @access Private
const createNewDemandSlip = asyncHandler(async (req,res)=>{
    const {employeeId,
           deliveryPartnerName,
           distributorName,
           orderedProductList } = req.body

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
        deliveryPartnerName,
        distributorName,
        orderedProductList,
    }

    const clientDemandSlip = {
        ticketNumber,
        date,
        employeeId,
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
    const { roles } = req

    // Check for Admin status
    if(!roles.includes("Admin")){
        res.status(403)
        throw new Error("Forbidden")
    }

    orders = await Demandslip?.find().lean()
    res.status(200).json(orders)
})

// @desc   Get date filtered Demand Slips
// @route  POST /api/order/filter/:date
// @access Private
const getFilteredDemandSlips = asyncHandler(async(req,res)=>{
    const { date } = req.params
    const { employeeId, status } = req.body
    const { roles } = req
    
    var orders

    // Check if User exists
    if(employeeId){
        const user = await User.findById({_id:employeeId}).lean().exec()
        
        if(!user){
            res.status(400)
            throw new Error('User not found')
        }
    }
    

    if( status && !(status==="pending" || status==="fulfilled" 
        || status==="failed" || status==="partial")
        ){
            res.status(400)
            throw new Error('Bad Request')
    }

    // Check for Admin and Manager status
    if((roles.includes("Admin") || roles.includes("Manager")) 
        && !employeeId){
        
        if(status){
            orders = await Demandslip.find({ticketNumber:{ $regex:date}, status}).lean()
        }else{
            orders = await Demandslip.find({ticketNumber:{ $regex:date}}).lean()
        }
    }else{
        // For Employee status
        if(status){
            orders = await Demandslip.find({ 
                status,
                employeeId,
                ticketNumber:{ $regex: date}
            
            }).lean()
        }else{
            orders = await Demandslip.find({
                    employeeId,
                    ticketNumber:{ $regex: date}
                
            }).lean()
        }
    }


    res.status(200).json(orders)
})

// @desc   Update pending Demand Slip (Admin can update closed tickets)
// @route  PATCH /api/order/:ticketNumber
// @access Private
const updateAfterDelivery = asyncHandler(async(req,res)=>{
    const { employeeId, status, recievedProductList,totalCost } = req.body
    const { ticketNumber } = req.params
    
    const demandSlip = await Demandslip.findOne({ticketNumber:ticketNumber}).exec()

    if(!employeeId || !status || (status!=="failed" && !totalCost)
        ){
        res.status(400)
        throw new Error('All fields are requied')
    }

    // Check if User exists
    const user = await User.findById({_id:employeeId}).lean().exec()
    
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }

    // Check for existing ticket
    if(!demandSlip){
        res.status(400)
        throw new Error("Demand Slip not found")
    }

    // Check if ticket status is pending or if User has Admin access
    if(user)
    if(demandSlip.status!=="pending" && !user.roles.includes("Admin") || 
        (employeeId!==demandSlip.employeeId.toString() && !user.roles.includes("Admin"))){
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
        employeeId: demandSlip.employeeId,
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
    const { username, roles } = req
    const { ticketNumber } = req.params

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
        employeeId: demandSlip.employeeId,
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
    const { roles } = req

    // Check for Admin status
    if(!roles.includes("Admin")){
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
    const { roles } = req

    // Check for Admin status
    if(!roles.includes("Admin")){
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