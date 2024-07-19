const fs = require("fs")
const PDFDocument = require("./pdfkit-tables")
const asyncHandler = require('express-async-handler')

const Counter = require('../models/counterModel')
const Demandslip = require('../models/demandslipModel')

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
        await Demandslip.updateMany({status:"pending"},{$set:{status:"failed"}})
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

// @desc   Genearet SKU for Incomplete Demand Slip Data
const generateSKUforIncompleteData = asyncHandler(async(orderedProductList)=>{
    const updatedOrderList = orderedProductList.map((item)=>{
        let pN, bC, newSKU, newProdFullName

        if(item.partNum && item.partNum!==""){
            const spaceRemovedPN = item.partNum.replace(/ /g,"")
            const cleanedPN = spaceRemovedPN.split("-").join("")
            const cleanedPN2 = cleanedPN.split("/").join("")
            pN = cleanedPN2.toUpperCase()
        }
        
        if(item.brandCompany && item.brandCompany!==""){
            const spaceRemovedBC = item.brandCompany.replace(/ /g,"").toUpperCase()
            const cleanedBC = spaceRemovedBC.slice(0,3)
            bC = cleanedBC
        }

        switch(item){
            case (!item.partNum && !item.brandCompany):
                newSKU = item.sku
                newProdFullName = item.productFullName
                break;

            case (item.partNum && !item.brandCompany):
                newSKU = item.sku +"-"+ pN
                newProdFullName = item.productFullName +"-"+ spaceRemovedPN
                break;
            
            case (item.partNum && item.brandCompany):
                newSKU = item.sku +"-"+ bC +"-"+ pN
                newProdFullName = item.productFullName +"-"+ spaceRemovedBC +"-"+ spaceRemovedPN
                break;

            default:
                newSKU = item.sku
                newProdFullName = item.productFullName
                break;
            
        }
    })

    return updatedOrderList
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

    doc.moveDown().table(table,100,150, {width:288}, headerInfo);
                
    // doc.on('end', function () {
        // fs.unlink(`../DemandSlips/DemandSlip-${ticketNumber}.pdf`, (err => { 
        //     if (err) console.log(err)
        //     else { 
        //       console.log(`\nDeleted file: DemandSlip-${ticketNumber}.pdf`); 
        //     }
        // }))
    // })

    doc.end();  
}


module.exports = {
    generateTicket,
    generateSKUforIncompleteData,
    generateDemandReciept,
}