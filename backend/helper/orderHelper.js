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
const generateSKUforIncompleteData = (orderedProductList)=>{
    const updatedOrderList = orderedProductList.map((item)=>{
        let pN, spaceRemovedPN, bC, spaceRemovedBC, newSKU, newProdFullName

        if(item.partNum && item.partNum!==""){
            spaceRemovedPN = item.partNum.replace(/\s/g,"").toUpperCase()
            pN = spaceRemovedPN.replace(/[-/]/g,"")
        }
        
        if(item.brandCompany && item.brandCompany!==""){
            spaceRemovedBC = item.brandCompany.replace(/\s/g,"").toUpperCase()
            const cleanedBC = spaceRemovedBC.slice(0,3)
            bC = cleanedBC
        }

        if(!item.partNum && !item.brandCompany){
            // No update to SKu
            newSKU = item.sku
            newProdFullName = item.productFullName
        }else if(item.partNum && !item.brandCompany){
            // Only Part Num update
            newSKU = item.sku +"-"+ pN
            newProdFullName = item.productFullName +" "+ spaceRemovedPN
        }else if(item.partNum && item.brandCompany){
            // Brand Company and Part Num update
            newSKU = item.sku +"-"+ bC +"-"+ pN
            newProdFullName = item.productFullName +" "+ spaceRemovedBC +" "+ spaceRemovedPN
        }

        let newItem = {
            sku: newSKU,
            productFullName: newProdFullName,
            quantity: item.quantity,
            unit: item.unit
        }

        return newItem
    })
    
    return updatedOrderList
}

// @desc   Clean Non-existing Data for Review Collection
const cleanDataFoReview = (newDataList, ticketNumber, username) =>{
    const cleanedData = newDataList.map((item)=>{
        let itemCode, productName, partNum, vehicleModel, brandCompany

        itemCode = item.sku.split("-")[0]
        productName = item.productFullName.split(" ")[0]
        vehicleModel = item.productFullName.split(" ")[1]
        brandCompany = item.productFullName.split(" ")[2]
        partNum = item.productFullName.split(" ")[3]

        let updatedItem = {
            ticketNumber: ticketNumber,
            username:username,
            sku: item.sku,
            itemCode,
            productName,
            vehicleModel,
            brandCompany,
            partNum,
            qty:item.quantity,
            unit: item.unit,
            productFullName: item.productFullName,
        }

        return updatedItem
    })

    // console.log(`reviewList:${cleanedData}`)

    return cleanedData
} 

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
    cleanDataFoReview,
    generateDemandReciept,
}