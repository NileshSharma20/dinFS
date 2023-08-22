const fs = require("fs")
const PDFDocument = require("./pdfkit-tables")
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
    const date = `${ticketDate}-${ticketMonth}-${ticketYear}` 
    
    const ticketNumber = counter.toString().padStart(3, '0')+fullDate
    
    count.counterNumber = count.counterNumber+1
    await count.save()

    console.log(`ticketID:${ticketNumber}`)

    return {ticketNumber, date}
})

// @desc   Generating Demand Reciept PDF
const generateDemandReciept=(ticketNumber, distributorName, date, prodData)=>{

    // Create new PDF Document
    const doc = new PDFDocument();
    
    // Pipe PDF into the Invoice
    doc.pipe(fs.createWriteStream(`../DemandSlips/DemandSlip-${ticketNumber}.pdf`))
    
    const table = {
        headers:["SKU","Qty"],
        rows:[]
    }

    // Generating PDF
    for (const prod of prodData){
        table.rows.push([prod.sku,prod.quantity])
    }
    const headerInfo = {
        distributorName,
        ticketNumber,
        date
    }

    doc.moveDown().table(table,100,150, {width:400}, headerInfo);

    doc.end();
}

module.exports = {
    generateTicket,
    generateDemandReciept
}