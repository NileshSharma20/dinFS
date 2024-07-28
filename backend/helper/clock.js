// const { generateTicket } = require("./orderHelper")
const asyncHandler = require("express-async-handler")
// const { getFilteredDemandSlips } = require("../controllers/orderController")

const Counter = require('../models/counterModel')
const Demandslip = require("../models/demandslipModel")

// @desc   setInterval function to be called at Top level 
const clockInterval = ()=>{
    // console.log(`clockInterval`)
    setInterval(clockEvents, 11.5*60*60*1000)
}

// @desc   Time triggered functions
const clockEvents = asyncHandler(async() => {
    // console.log(`clockEvents`)
    const currTime = new Date()
    let date = currTime.getDate()
    let hour = currTime.getHours()

    const count = await Counter.findOne({counterType:"DemandSlip"}).exec()
    
    // console.log(`pendingList:${JSON.stringify(pendingDemandSlipList,null,4)}`)
    
    if(!count){
        return 
        // console.log(`No Counter found`)
    }
    
    if( (date===count.date && hour>=21) 
    // && (date==count.date && hour<19) 
    ){
        // await Demandslip.updateMany({status:"pending"},{$set:{status:"failed"}})
        count.counterNumber = 1
    }else if( (date!==count.date && hour<9)){
        // await Demandslip.updateMany({status:"pending"},{$set:{status:"failed"}})
        count.counterNumber = 1
        count.date = date
    }
    
    const updateCounter = await count.save()

    return updateCounter
})

module.exports={
    clockEvents,
    clockInterval,
}