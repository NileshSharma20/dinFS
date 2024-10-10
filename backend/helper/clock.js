const asyncHandler = require("express-async-handler")

const Counter = require('../models/counterModel')

// @desc   setInterval function to be called at Top level 
const clockInterval = ()=>{
    setInterval(clockEvents, 11.5*60*60*1000)
}

// @desc   Time triggered functions
const clockEvents = asyncHandler(async() => {
    // console.log(`clockEvents`)
    const currTime = new Date()
    let date = currTime.getDate()
    let hour = currTime.getHours()

    const demandSlipCount = await Counter.findOne({counterType:"DemandSlip"}).exec()
    const billCount = await Counter.findOne({counterType:"Bill"}).exec()
    
    if( demandSlipCount && (date===demandSlipCount.date && hour>=21) ){
        demandSlipCount.counterNumber = 1
    }else if( demandSlipCount && (date!==demandSlipCount.date && hour<9)){
        demandSlipCount.counterNumber = 1
        demandSlipCount.date = date
    }

    if( billCount && (date===billCount.date && hour>=21) ){
        billCount.counterNumber = 1
    }else if( billCount && (date!==billCount.date && hour<9)){
        billCount.counterNumber = 1
        billCount.date = date
    }
    
    const updateDemandslipCounter = await demandSlipCount.save()
    const updateBillCounter = await billCount.save()

    return
})

module.exports={
    clockEvents,
    clockInterval,
}