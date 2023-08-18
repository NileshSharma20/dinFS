const asyncHandler = require('express-async-handler')
const Counter = require('../models/counterModel')

// @desc   Genearet Ticket number for Demand Slip
const generateTicket = asyncHandler(async()=>{
    let currDate = new Date()
    let ticketDate = currDate.getDate()
    let ticketMonth = currDate.getMonth()+1
    let ticketYear = currDate.getFullYear()


    const count = await Counter.findOne({counterType:"DemandSlip"}).exec()

    if(count.date !== ticketDate){
        count.counterNumber = 1
        count.date = ticketDate
    }

    if(ticketMonth<10){
        ticketMonth = `0${ticketMonth}`
    }

    const counter = count.counterNumber 
    
    
    const fullDate = ticketDate+ ticketMonth+ ticketYear
    
    const ticket = counter.toString().padStart(3, '0')+fullDate
    
    count.counterNumber = count.counterNumber+1
    await count.save()

    console.log(`ticketID:${ticket}`)

    return ticket
})

module.exports = {
    generateTicket,
}