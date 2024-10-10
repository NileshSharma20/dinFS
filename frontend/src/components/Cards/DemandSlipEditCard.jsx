import React, { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'
import UpdateOrderForm from '../Forms/UpdateOrderForm'
import useAuth from '../../hooks/useAuth'

function DemandSlipEditCard({info}) {
    const {isAdmin, isManager} = useAuth()

    const [editFlag, setEditFlag] = useState(false)

    const pdfBodyData = info.orderedProductList.map((order)=>{
      return [order.productFullName,order.quantity+` `+order.unit]
    })

    const ticketDate = info.ticketNumber.slice(3,5)+"-"+info.ticketNumber.slice(5,7)+"-"+info.ticketNumber.slice(7) 
    
    // useEffect(()=>{
    //   console.log(Array.isArray(pdfBodyData))
    //   console.log(`\npdfBodyData:${JSON.stringify(info,null,4)}`)
    // },[])

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
      <div style={{width:`100%`, height:'100%'}}>
        <UpdateOrderForm initialValue={info} setFlag={setEditFlag}/>
      </div>
      :
      <>
      <div style={{width:`100%`}}>
        <div className="card-row">
            <div className="card-element">

            <h3>{info.ticketNumber}</h3>
            {(isAdmin||isManager) && 
            <h3>{info?.username}</h3>
            }
            </div>
        </div>

        <br />

        <div className="card-row">
            <div className="card-element">
                <h3>Delivery Partner</h3>
                <p>{info.deliveryPartnerName}</p>
            </div>

            <div className="card-element">
                <h3>Distributor</h3> 
                <p>{info.distributorName}</p>
            </div>
        </div>

        <br />

        <div className="card-grid-row">
            <h3></h3>
            <h3>Products</h3>
            <h3>Ordered</h3> 
        </div>

        <div className='card-grid-prod-box'>
            {info.orderedProductList?.map((prod,i)=>
                <div className="card-grid-row" key={i}>
                    <p>{i+1}.</p>

                    <div className="card-element">

                        <p style={{fontWeight:`bold`}}>{prod.productFullName}</p>
                        <p>{prod.sku}</p>
                    </div>

                    <p>{prod.quantity} {prod.unit}</p> 
            </div>
            )}
          </div>

        <br />

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

export default DemandSlipEditCard