const { generateTicket } = require("./orderHelper")

const Counter = require('../models/counterModel')
const asyncHandler = require("express-async-handler")

// @desc   setInterval function to be called at Top level 
const clockInterval = ()=>{
    setInterval(clockEvents, 11.5*60*60*1000)
}

// @desc   Time triggered functions
const clockEvents = asyncHandler(async() => {
    const currTime = new Date()
    let date = currTime.getDate()
    let hour = currTime.getHours()

    const count = await Counter.findOne({counterType:"DemandSlip"}).exec()

    if(!count){
        return console.log(`No Counter found`)
    }

    if( (date===count.date && hour>=17) && (date==count.date && hour<19) ){
        count.counterNumber = 1
    }else if( (date!==count.date && hour<8)){
        count.counterNumber = 1
        count.date = date
    }

    // Fail all pending demand slips

    // console.log(`Counter:${count.counterNumber}`)
    const updateCounter = await count.save()
    // await generateTicket()

    return updateCounter
})

module.exports={
    clockEvents,
    clockInterval,
}