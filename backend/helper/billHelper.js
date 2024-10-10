const Counter = require('../models/counterModel')
const asyncHandler = require('express-async-handler')

// @desc   Genearet Ticket number for Bill
const generateBillTicket = asyncHandler(async()=>{
    let currDate = new Date()
    let ticketDate = currDate.getDate()
    let ticketMonth = currDate.getMonth()+1
    let ticketYear = currDate.getFullYear()


    const count = await Counter.findOne({counterType:"Bill"}).exec()

    if(count.date !== ticketDate){
        count.counterNumber = 1
        count.date = ticketDate
        // await Demandslip.updateMany({status:"pending"},{$set:{status:"failed"}})
    }
    if(ticketDate<10){
        ticketDate = `0${ticketDate}`
    }

    if(ticketMonth<10){
        ticketMonth = `0${ticketMonth}`
    }

    const counter = count.counterNumber 
    
    
    const fullDate = `${ticketDate}${ticketMonth}${ticketYear}`
    const date = `${ticketDate}-${ticketMonth}-${ticketYear}` 
    
    const ticketNumber = counter.toString().padStart(3, '0')+fullDate
    
    count.counterNumber = count.counterNumber+1
    await count.save()

    // console.log(`ticketID:${ticketNumber}`)

    return {ticketNumber, date}
})

module.exports = {
    generateBillTicket,
}