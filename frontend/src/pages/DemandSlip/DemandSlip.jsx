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

function DemandSlip() {
  const dispatch = useDispatch()

  const {token} = useSelector((state)=>state.auth)
  const { orderData, isLoading } = useSelector((state)=>state.orders)

  const [pendingOrderList, setPendingOrderList] = useState(orderData?.filter((item)=>item.status==="pending"))
  const [partialOrderList, setPartialOrderList] = useState(orderData?.filter((item)=>item.status==="partial"))
  const [failedOrderList, setFailedOrderList] = useState(orderData?.filter((item)=>item.status==="failed"))
  const [fulfilledOrderList, setFulfilledOrderList] = useState(orderData?.filter((item)=>item.status==="fulfilled"))

  const [createFlag, setCreateFlag] = useState(true)
  const [allFlag, setAllFlag] = useState(false)
  const [pendingFlag, setPendingFlag] = useState(false)
  const [fulfilledFlag, setFulfilledFlag] = useState(false)
  const [failedFlag, setFailedFlag] = useState(false)
  const [partialFlag, setPartialFlag] = useState(false)

  const [displayList, setDisplayList] = useState(orderData)

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

  useEffect(()=>{
    setPendingOrderList(orderData.filter((item)=>item.status==="pending"))
    setFailedOrderList(orderData.filter((item)=>item.status==="failed"))
    setPartialOrderList(orderData.filter((item)=>item.status==="partial"))
    setFulfilledOrderList(orderData.filter((item)=>item.status==="fulfilled"))
  },[orderData])

  useEffect(()=>{
    if(allFlag){
      setDisplayList(orderData)
    }
    if(pendingFlag){
      setDisplayList(pendingOrderList)
    }else if(failedFlag){
      setDisplayList(failedOrderList)
    }else if(partialFlag){
      setDisplayList(partialOrderList)
    }else if(fulfilledFlag){
      setDisplayList(fulfilledOrderList)
    }

  },[allFlag, pendingFlag, failedFlag, partialFlag, fulfilledFlag, orderData])
  
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

      <div className="ds-filter-data-container"
      >
        {createFlag?
        <>
        <div className="ds-content"
          //  style={{gridColumn:"1 / span 2"}}
        >
          {/* Create Demand Slip */}
        <div className="ds-search-container">
            <QuickProdSearchForm setToggleFlag={setCreateFlag} passNextFlag={setPendingFlag} />
        </div>
        </div>

        </>
        :
        <>
        <div className="ds-content ds-card-content"
        // style={{gridColumn:"1 / span 2"}}
        >
            {displayList.map((order,key)=>{
                return (
                <div className="ds-slip-box" key={key}>
                  {pendingFlag && <div className="edit-btn">
                    <FiEdit2 />
                  </div>}

                  <p>{order.ticketNumber}</p>
                  <p>{order.status}</p>
                  <p>{order.deliveryPartnerName}</p>
                  <p>{order.distributorName}</p>
                  <div>{order.orderedProductList.map((prod,k)=>{
                      return (
                        <div key={k}>

                        <span>
                          {prod.sku ? prod.sku:prod.productFullName}
                        </span>
                        <br />
                        <span>{prod.quantity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                )
              })}
              {/* <h3>Single Slip</h3> */}

          {/* <div className="ds-slip-box">
              <h3>Single Slip</h3>
          </div> */}
          <br />
          
          {/* {
            <>

            <div className="pdf-btn"
              onClick={(e)=>handlePDFGenerate()}
              >
              Generate PDF
            </div>
            </>
          } */}
        </div>
        </>
        }


        

    
      </div>

    </div>
    </>
  )
} 

export default DemandSlip