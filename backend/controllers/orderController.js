const asyncHandler = require('express-async-handler')
const { generateTicket, generateDemandReciept } = require("../helper/orderHelper")

const Demandslip = require("../models/demandslipModel")
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
    
    const demandSlip = await Demandslip.create(newDemandSlip)
    await generateDemandReciept(ticketNumber,distributorName,date,orderedProductList)

    if(demandSlip){
        res.status(201).json({message:`New Demand Slip ${ticketNumber} created`})
    }else{
        res.status(400)
        throw new Error(`Invalid data`)
    }
})

// @desc   Update pending Demand Slip (Admin can update closed tickets)
// @route  PATCH /api/order/:ticketNumber
// @access Private
const updateAfterDelivery = asyncHandler(async(req,res)=>{
    const { employeeId, status, recievedProductList,totalCost } = req.body
    const { ticketNumber } = req.params
    
    const demandSlip = await Demandslip.findOne({ticketNumber:ticketNumber}).exec()

    if(!employeeId || !status || (status!=="failed" && !totalCost)){
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

    const updatedDemandslip = await demandSlip.save()

    res.json({message:`${updatedDemandslip.ticketNumber} with status ${updatedDemandslip.status}`})
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
        throw new Error("Demand Slip not found")
    }

    const result = await demandSlip.deleteOne()

    const message = `Demand Slip ${result.ticketNumber} deleted by Admin ${username}`

    res.status(200).json({message})
})

module.exports={
    createNewDemandSlip,
    updateAfterDelivery,
    deleteDemandSlip
}