import React, { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'
import UpdateOrderForm from '../Forms/UpdateOrderForm'

function DemandSlipCard({info}) {
    const [editFlag, setEditFlag] = useState(false)

    const pdfBodyData = info.orderedProductList.map((order)=>{
      return [order.productFullName,order.quantity]
    })

    const ticketDate = info.ticketNumber.slice(3,5)+"-"+info.ticketNumber.slice(5,7)+"-"+info.ticketNumber.slice(7) 
    
    useEffect(()=>{
      console.log(Array.isArray(pdfBodyData))
      console.log(`\npdfBodyData:${JSON.stringify(info,null,4)}`)
    },[])

    const addHeaderAndFooter = doc => {
      const pageCount = doc.internal.getNumberOfPages()
      doc.setFont('helvetica', 'normal')
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(17)
        doc.text('NAS',doc.internal.pageSize.width/2,40,{align:"center"})
        
        doc.setFontSize(10)
        doc.text('Demand Reciept / Quotation',doc.internal.pageSize.width/2,55,{align:"center"})
        
        doc.text(20,75,`TID: ${info.ticketNumber}`)
      
        doc.text(20,90,`Date: ${ticketDate}`)
        
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
      // const bodyData = [
      //               ["DPD-ACC-SUZ-59300085000","5"],
      //               ["SKR-ACT-HON-51400KWP902","2"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //               ["SKR-ACT-HON-51400KWP902","10"],
      //             ]
  
      var doc = new jsPDF('p','pt',[201,470])
  
      doc.setProperties({
          title: `DemandSlip${info.ticketNumber}`
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
        body: pdfBodyData})
  
      addHeaderAndFooter(doc)
  
      doc.output('dataurlnewwindow',{filename:`DemandSlip${info.ticketNumber}`})
      doc.save(`DemandSlip${info.ticketNumber}`)
    }

  return (
    <>
    
    <div className='ds-slip-box'>
        
        <div className='edit-btn' 
            onClick={()=>setEditFlag(!editFlag)}>
            {editFlag?<AiOutlineClose />:<FiEdit2 />}
        </div>

      {editFlag?
      <UpdateOrderForm initialValue={info} setFlag={setEditFlag}/>
      :
      <>
        <p><span>Ticket Number: </span> {info.ticketNumber}</p>
        <p><span>Delivery Partner Name: </span>{info.deliveryPartnerName}</p>
        <p><span>Distributor Name: </span> {info.distributorName}</p>
        <p><span>Status: </span> {info.status}</p>
        <p><span>Total Cost: </span>{info.totalCost}</p>
        {/* <br /> */}
        <p><span>Products: </span></p>
        <div className='ds-new-col'>
            {info.orderedProductList?.map((prod,i)=>
                <React.Fragment key={i}>
                    <p><span>SKU: </span>{prod.sku}</p>
                    <p><span>Full Name: </span>{prod.productFullName}</p>
                    <p><span>Qty: </span>{prod.quantity}</p>
                    <br />
                </React.Fragment>  
            )}
        </div>

        <div className="pdf-btn"
          onClick={(e)=>handlePDFGenerate()}
          >
          Generate PDF
        </div>
      </>
      }
    </div>
    </>
  )
}

export default DemandSlipCard