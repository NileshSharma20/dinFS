import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function DemandSlipTemplate() {
  const testData = {
    ticketID:"00718082023",
    employeeId:"",
    deliveryPartnerName:"Suraj",
    distributorName:"M K Auto",
    orderedProductList:{},
  }

  const date = testData.ticketID.slice(3,5)+"-"+testData.ticketID.slice(5,7)+"-"+testData.ticketID.slice(7) 

  const addHeaderAndFooter = doc => {
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'normal')
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(17)
      doc.text('Nilam Auto Spares',doc.internal.pageSize.width/2,40,{align:"center"})
      
      doc.setFontSize(10)
      doc.text('Demand Reciept / Quotation',doc.internal.pageSize.width/2,55,{align:"center"})
      
      doc.text(20,75,`TID: ${testData.ticketID}`)
    
      doc.text(20,90,`Date: ${date}`)
      
      // doc.text(20,105,`Dist.: ${testData.distributorName}`)

      doc.setFontSize(8)
      
      doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2,  doc.internal.pageSize.height - 20, {
        align: 'center'
      })
      doc.text('This is an auto generated quotation', doc.internal.pageSize.width / 2,  doc.internal.pageSize.height - 10, {
        align: 'center'
      })
    }
  }

  const handlePDFGenerate=()=>{

    const headerData = ["Product","Qty"]
    const bodyData = [
                  ["DPD-ACC-SUZ-59300085000","5"],
                  ["SKR-ACT-HON-51400KWP902","2"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                  ["SKR-ACT-HON-51400KWP902","10"],
                ]

    var doc = new jsPDF('p','pt',[201,470])

    doc.setProperties({
        title: `DemandSlip${testData.ticketID}`
    });    
    
    autoTable(doc,{
      startY:105,
      margin:{left:20,top:105},
      rowPageBreak:"avoid",
      tableWidth:161,
      theme:"plain",
      headStyles:{halign:"center"},
      // bodyStyles:{lineWidth:1},
      columnStyles: { 1: { cellWidth:50, halign:'center'} },
      head:[headerData],
      body:bodyData})

    addHeaderAndFooter(doc)

    doc.output('dataurlnewwindow',{filename:`DemandSlip${testData.ticketID}`})
    doc.save(`DemandSlip${testData.ticketID}`)
  }

  return (
    <div>DemandSlipTemplate</div>
  )
}

export default DemandSlipTemplate