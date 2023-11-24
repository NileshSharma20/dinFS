import React, { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FiEdit2 } from 'react-icons/fi'

import "./DemandSlip.css"
import QuickProdSearchForm from '../../components/Forms/QuickProdSearchForm'
import { useDispatch, useSelector } from 'react-redux'
import { getFilteredDemandSlips } from '../../features/orders/orderSlice'
import Loader from '../../components/Loader/Loader'
import LoginAgainModal from '../../components/Modals/LoginAgainModal'
import DemandSlipCard from '../../components/Cards/DemandSlipCard'

function DemandSlip() {
  const dispatch = useDispatch()

  const {token} = useSelector((state)=>state.auth)
  const { orderData, 
          pendingOrderList,
          partialOrderList,
          failedOrderList,
          fulfilledOrderList,
          isLoading } = useSelector((state)=>state.orders)

  // const [pendingOrderList, setPendingOrderList] = useState(orderData?.filter((item)=>item.status==="pending"))
  // const [partialOrderList, setPartialOrderList] = useState(orderData?.filter((item)=>item.status==="partial"))
  // const [failedOrderList, setFailedOrderList] = useState(orderData?.filter((item)=>item.status==="failed"))
  // const [fulfilledOrderList, setFulfilledOrderList] = useState(orderData?.filter((item)=>item.status==="fulfilled"))

  const [createFlag, setCreateFlag] = useState(false)
  const [allFlag, setAllFlag] = useState(true)
  const [pendingFlag, setPendingFlag] = useState(false)
  const [fulfilledFlag, setFulfilledFlag] = useState(false)
  const [failedFlag, setFailedFlag] = useState(false)
  const [partialFlag, setPartialFlag] = useState(false)

  const testData = {
    ticketID:"00718082023",
    employeeId:"",
    deliveryPartnerName:"Suraj",
    distributorName:"M K Auto",
    orderedProductList:{},
  }

  const date = testData.ticketID.slice(3,5)+"-"+testData.ticketID.slice(5,7)+"-"+testData.ticketID.slice(7) 

  const handleCreateClick=()=>{
    setCreateFlag(true)

    setAllFlag(false)
    setFailedFlag(false)
    setPartialFlag(false)
    setPendingFlag(false)
    setFulfilledFlag(false)
  }

  const handleAllClick=()=>{
    setAllFlag(true)
    
    setCreateFlag(false)
    setFailedFlag(false)
    setPartialFlag(false)
    setPendingFlag(false)
    setFulfilledFlag(false)
    
  }

  const handlePendingClick=()=>{
    setPendingFlag(true)

    setCreateFlag(false)
    setAllFlag(false)
    setFailedFlag(false)
    setPartialFlag(false)
    setFulfilledFlag(false)
  }

  const handlePartialClick=()=>{
    setPartialFlag(true)
    
    setCreateFlag(false)
    setAllFlag(false)
    setPendingFlag(false)
    setFailedFlag(false)
    setFulfilledFlag(false)
  }

  const handleFailedClick=()=>{
    setFailedFlag(true)
    
    setCreateFlag(false)
    setAllFlag(false)
    setPendingFlag(false)
    setPartialFlag(false)
    setFulfilledFlag(false)
  }

  const handleFulfilledClick=()=>{
    setFulfilledFlag(true)
    
    setCreateFlag(false)
    setAllFlag(false)
    setPendingFlag(false)
    setFailedFlag(false)
    setPartialFlag(false)
  }

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

  useEffect(()=>{
    dispatch(getFilteredDemandSlips())
  },[])

  // useEffect(()=>{
  //   if(allFlag){
  //     setDisplayList(orderData)
  //   }
  //   else if(pendingFlag){
  //     setDisplayList(pendingOrderList)
  //   }else if(failedFlag){
  //     setDisplayList(failedOrderList)
  //   }else if(partialFlag){
  //     setDisplayList(partialOrderList)
  //   }else if(fulfilledFlag){
  //     setDisplayList(fulfilledOrderList)
  //   }

  // },[allFlag, pendingFlag, failedFlag, partialFlag, fulfilledFlag, orderData])
  
  // useEffect(()=>{
  //   console.log(`dL:${JSON.stringify(displayList,null,4)}`)
  // },[displayList])


  return (
    <>
    {!token && <LoginAgainModal />}
    {isLoading && <Loader/>}
    <div className='container' 
      style={{
        // border:'1px solid red', 
        justifyContent:"flex-start",
        
      }}
    >
      <div className="ds-filter-container">
        
        <div className={`ds-filter-btn ${createFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handleCreateClick()}
        >
          Create          
        </div>

        <div className={`ds-filter-btn ${allFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handleAllClick()}
        >
          All
        </div>
        
        <div className={`ds-filter-btn ${pendingFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handlePendingClick()}
        >
          Pending
        </div>
        
        <div className={`ds-filter-btn ${partialFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handlePartialClick()}
        >
          Partial
        </div>

        <div className={`ds-filter-btn ${failedFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handleFailedClick()}
        >
          Failed
        </div>
        
        <div className={`ds-filter-btn ${fulfilledFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handleFulfilledClick()}
        >
          Fulfilled        
        </div>


      </div>

      <div className="ds-filter-data-container">
        
        {/* Create Demand Slip */}
        {createFlag &&
        <>
        <div className="ds-content"
        >
        <div className="ds-search-container">
            <QuickProdSearchForm setToggleFlag={setCreateFlag} passNextFlag={setPendingFlag} />
        </div>
        </div>

        </>
        }

        {/* All Orders */}
        {allFlag &&
        <>
        <div className="ds-content ds-card-content">
          {orderData.length>0?
            orderData.map((order,key)=>{
                return (
                <div className="ds-slip-box" key={key}>
                  <p><span>Ticket Number: </span> {order.ticketNumber}</p>
                  <p><span>Delivery Partner Name: </span>{order.deliveryPartnerName}</p>
                  <p><span>Distributor Name: </span> {order.distributorName}</p>
                  <p><span>Status: </span> {order.status}</p>
                  <p><span>Total Cost: </span>{order.totalCost}</p>
                  <p><span>Products: </span></p>
                  <div className='ds-new-col'>
                      {order.orderedProductList?.map((prod,i)=>
                          <React.Fragment key={i}>
                              <p><span>SKU: </span>{prod.sku}</p>
                              <p><span>Full Name: </span>{prod.productFullName}</p>
                              <p><span>Qty: </span>{prod.quantity}</p>
                              <br />
                          </React.Fragment>  
                      )}
                  </div>
                </div>
                )
              })
              :
              <div style={{gridColumn:"1/span 3"}}>
                <h1>No Orders Today</h1>
              </div>
            }
          <br />
          
        </div>
        </>

        }

        {/* Pending Orders */}
        {pendingFlag &&
        <>
        <div className="ds-content ds-card-content">
            {pendingOrderList.length>0?
            pendingOrderList.map((order,key)=>{
                return (
                  <React.Fragment key={key}>
                    <DemandSlipCard info={order}/>
                  </React.Fragment>
                )
              })
            :
            <div style={{gridColumn:"1/span 3"}}>
              <h1>No Pending Orders</h1>
            </div> 
            }
          <br />
          
        </div>
        </>
        }

        {/* Partial Orders */}
        {partialFlag &&
        <>
        <div className="ds-content ds-card-content">
            {partialOrderList.length>0?
            partialOrderList.map((order,key)=>{
                return (
                <div className="ds-slip-box" key={key}>
                  <p><span>Ticket Number: </span> {order.ticketNumber}</p>
                  <p><span>Delivery Partner Name: </span>{order.deliveryPartnerName}</p>
                  <p><span>Distributor Name: </span> {order.distributorName}</p>
                  <p><span>Status: </span> {order.status}</p>
                  <p><span>Total Cost: </span>{order.totalCost}</p>
                  <p><span>Products: </span></p>
                  <div className='ds-new-col'>
                      {order.orderedProductList?.map((prod,i)=>
                          <React.Fragment key={i}>
                              <p><span>SKU: </span>{prod.sku}</p>
                              <p><span>Full Name: </span>{prod.productFullName}</p>
                              <p><span>Qty: </span>{prod.quantity}</p>
                              <br />
                          </React.Fragment>  
                      )}
                  </div>
                </div>
                )
              })
            :
            <div style={{gridColumn:"1/span 3"}}>
              <h1>No Partial Status Orders</h1>
            </div> 
            }
          <br />
          
        </div>
        </>

        }

        {/* Failed Orders */}
        {failedFlag &&
        <>
        <div className="ds-content ds-card-content">
            {failedOrderList.length>0?
            failedOrderList.map((order,key)=>{
                return (
                <div className="ds-slip-box" key={key}>
                  <p><span>Ticket Number: </span> {order.ticketNumber}</p>
                  <p><span>Delivery Partner Name: </span>{order.deliveryPartnerName}</p>
                  <p><span>Distributor Name: </span> {order.distributorName}</p>
                  <p><span>Status: </span> {order.status}</p>
                  <p><span>Total Cost: </span>{order.totalCost}</p>
                  <p><span>Products: </span></p>
                  <div className='ds-new-col'>
                      {order.orderedProductList?.map((prod,i)=>
                          <React.Fragment key={i}>
                              <p><span>SKU: </span>{prod.sku}</p>
                              <p><span>Full Name: </span>{prod.productFullName}</p>
                              <p><span>Qty: </span>{prod.quantity}</p>
                              <br />
                          </React.Fragment>  
                      )}
                  </div>
                </div>
                )
              })
              :
              <div style={{gridColumn:"1/span 3"}}>
                <h1>No Failed Status Orders</h1>
              </div>
            }
          <br />
          
        </div>
        </>

        }

        {/* Fulfilled Orders */}
        {fulfilledFlag &&
        <>
        <div className="ds-content ds-card-content">
            {fulfilledOrderList.length>0?
            fulfilledOrderList.map((order,key)=>{
                return (
                <div className="ds-slip-box" key={key}>
                  <p><span>Ticket Number: </span> {order.ticketNumber}</p>
                  <p><span>Delivery Partner Name: </span>{order.deliveryPartnerName}</p>
                  <p><span>Distributor Name: </span> {order.distributorName}</p>
                  <p><span>Status: </span> {order.status}</p>
                  <p><span>Total Cost: </span>{order.totalCost}</p>
                  <p><span>Products: </span></p>
                  <div className='ds-new-col'>
                      {order.orderedProductList?.map((prod,i)=>
                          <React.Fragment key={i}>
                              <p><span>SKU: </span>{prod.sku}</p>
                              <p><span>Full Name: </span>{prod.productFullName}</p>
                              <p><span>Qty: </span>{prod.quantity}</p>
                              <br />
                          </React.Fragment>  
                      )}
                  </div>
                </div>
                )
              })
              :
              <div style={{gridColumn:"1/span 3"}}>
                <h1>No Fulfilled Status Orders</h1>
              </div>
            }
          <br />
          
        </div>
        </>

        }


        

    
      </div>

    </div>
    </>
  )
} 

export default DemandSlip
{/* {
  <>

  <div className="pdf-btn"
    onClick={(e)=>handlePDFGenerate()}
    >
    Generate PDF
  </div>
  </>
} */}