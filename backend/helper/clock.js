const { generateTicket } = require("./orderHelper")
const asyncHandler = require("express-async-handler")
const { getFilteredDemandSlips } = require("../controllers/orderController")

const Counter = require('../models/counterModel')
const Demandslip = require("../models/demandslipModel")

// @desc   setInterval function to be called at Top level 
const clockInterval = ()=>{
    // console.log(`clockInterval`)
    setInterval(clockEvents, 11.5*60*60*1000)
    // setInterval(clockEvents, 1*60*1000)
}

// @desc   Time triggered functions
const clockEvents = asyncHandler(async() => {
    console.log(`clockEvents`)
    const currTime = new Date()
    let date = currTime.getDate()
    let hour = currTime.getHours()

    const count = await Counter.findOne({counterType:"DemandSlip"}).exec()

    // Fail all pending demand slips
    await Demandslip.updateMany({status:"pending"},{$set:{status:"failed", recieved}})
        // .select('-deliveryPartnerName -distributorName -orderedProductList -recievedProductList')
        // .lean()
    
    // console.log(`pendingList:${JSON.stringify(pendingDemandSlipList,null,4)}`)

    if(!count){
        return console.log(`No Counter found`)
    }

    if( (date===count.date && hour>=21) 
        // && (date==count.date && hour<19) 
    ){
        count.counterNumber = 1
    }else if( (date!==count.date && hour<8)){
        count.counterNumber = 1
        count.date = date
    }
    

    // console.log(`Counter:${count.counterNumber}`)
    const updateCounter = await count.save()
    // await generateTicket()

    return updateCounter
})

module.exports={
    clockEvents,
    clockInterval,
}