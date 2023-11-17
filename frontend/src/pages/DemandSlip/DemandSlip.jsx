import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import "./DemandSlip.css"
import QuickProdSearchForm from '../../components/Forms/QuickProdSearchForm'
import { useDispatch } from 'react-redux'
import { getFilteredDemandSlips } from '../../features/orders/orderSlice'

function DemandSlip() {
  const dispatch = useDispatch()

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
    <div className='container' style={{border:'1px solid red', justifyContent:"flex-start"}}>
      <div className="ds-filter-container">
        
        <div className="ds-filter-btn">
          Create          
        </div>

        <div className="ds-filter-btn ds-filer-btn-active">
          All
        </div>
        <div className="ds-filter-btn">
          Pending
        </div>
        <div className="ds-filter-btn">
          Failed
        </div>
        <div className="ds-filter-btn">
          Fulfilled        
        </div>


      </div>

      <div className="ds-filter-data-container">

        <div className="ds-content">
          <div className="ds-slip-box">
              <h3>Single Slip</h3>
          </div>

          <div className="ds-slip-box">
              <h3>Single Slip</h3>
          </div>

          <h3>Demand Slip</h3>
          <br />
          
          {
            <>
            <div className="pdf-btn"
              onClick={()=>dispatch(getFilteredDemandSlips())}
            >
              Get Slip Data
            </div>

            <div className="pdf-btn"
              onClick={(e)=>handlePDFGenerate()}
              >
              Generate PDF
            </div>
            </>
          }
        </div>

        <div className="ds-search-container">
            <QuickProdSearchForm />
        </div>

    
      </div>

    </div>
  )
} 

export default DemandSlip