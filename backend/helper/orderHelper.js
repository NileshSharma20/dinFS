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
    
    //Pipe PDF into the Invoice
    doc.pipe(fs.createWriteStream(`../DemandSlips/DemandSlip-${ticketNumber}.pdf`))
    
    // Add the header
    doc
        .fontSize(10)
        .text("Demand Reciept",55,65)
        .text(`${distributorName}`,55,80)
        .fontSize(20)
        .text("Dinesh Auto Spares",100,57,{ align: 'center', width: 400 })
        .fontSize(10)
        .text(`TID:${ticketNumber}`,200,65,{align:'right'})
        .text(`${date}`,200,80,{align:'right'})
        .moveDown();

    // Adding Table
    const table = {
        headers:["SKU","Qty"],
        rows:[]
    }

    // let i,topMargin = 200
    // generateTableRow(doc,10,200,"SKU","Qty")
    // for(i=0;i<prodData.length;i++){
    //     const position =topMargin+(i+1)*30
    //     generateTableRow(doc,10,position,prodData[i].sku,prodData[i].quantity)    
    // }

    for (const prod of prodData){
        table.rows.push([prod.sku,prod.quantity])
    }

    doc.moveDown().table(table,60,180, {width:480});

    // Adding Footer
    doc
        .fontSize(10)
        .text('This is an auto-generated Reciept. Thank you for your business.',
            50,
            710,
            { align: 'center', width: 500 },
        );

    doc.end();
}

// @desc   Generating Rows for PDF
const generateTableRow=(doc,fSize,y,c1,c2)=>{
    doc
        .fontSize(`${fSize}`)
        .text(c1, 60,y)
        .text(c2,200,y,{align:'right',margin:'0 10 0 0'})

}

module.exports = {
    generateTicket,
    generateDemandReciept
}