const fs = require("fs")
const PDFDocument = require("./pdfkit-tables")

// const =(ticketNumber, date, prodData)=>{

    // Create new PDF Document
    const doc = new PDFDocument();
    
    //Pipe PDF into the Invoice
    doc.pipe(fs.createWriteStream(`invoice.pdf`))
    
    // Add the header
    doc
        .fontSize(20)
        .text("Demand Reciept",110,57)
        .fontSize(10)
        .text(`TID:${ticketNumber}`,200,65,{align:'right'})
        .text(`${date}`,200,80,{align:'right'})
        .moveDown();

    doc
        .fontSize(10)
        .text('This is and auto-generated Invoice. Thank you for your business.',
            50,
            780,
            { align: 'center', width: 500 },
        );

    const table = {
        headers:["SKU","Qty"],
        rows:[]
    }

    for (const prod of prodData){
        table.rows.push([prod.sku,prod.quantity])
    }

    doc.moveDown().table(table,10,125, {width:590});

    doc.end();
// }