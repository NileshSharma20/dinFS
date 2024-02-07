import React, { useEffect, useState, useRef } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FiEdit2 } from 'react-icons/fi'

import "./DemandSlip.css"
import QuickProdSearchForm from '../../components/Forms/QuickProdSearchForm'
import { useDispatch, useSelector } from 'react-redux'
import { getAllDemandSlips, getFilteredDemandSlips } from '../../features/orders/orderSlice'
import Loader from '../../components/Loader/Loader'
import LoginAgainModal from '../../components/Modals/LoginAgainModal'
import DemandSlipCard from '../../components/Cards/DemandSlipCard'
import useAuth from '../../hooks/useAuth'
import { resetProducts } from '../../features/products/productSlice'
import { AiOutlineClose } from 'react-icons/ai'

function DemandSlip() {
  const dispatch = useDispatch()

  const { isAdmin, isManager } = useAuth()
  
  const dateInputRef = useRef(null);

  const {token} = useSelector((state)=>state.auth)
  const {prodCodeList} = useSelector((state)=>state.product)
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

  const [createFlag, setCreateFlag] = useState(true)
  const [allFlag, setAllFlag] = useState(false)
  const [pendingFlag, setPendingFlag] = useState(false)
  const [fulfilledFlag, setFulfilledFlag] = useState(false)
  const [failedFlag, setFailedFlag] = useState(false)
  const [partialFlag, setPartialFlag] = useState(false)

  const [legendFlag, setLegendFlag] = useState(false)

  // const DatePicker = () => {
  const [inputDate, setInputDate] = useState('');

  const handleDateChange = (e) => {
    setInputDate(e.target.value);
  }

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

  const handleLegendClick=()=>{
    setLegendFlag(!legendFlag)
  }

  const handleDateFilter=()=>{
    if(inputDate!==''){
      // Get filtered order data
      let inputYear = inputDate.slice(0,4)
      let inputMonth = inputDate.slice(5,7)
      let inputDay = inputDate.slice(8)
      let filterDate = inputDay+inputMonth+inputYear
      console.log(`formatted Date:${inputDay+inputMonth+inputYear}`)
      dispatch(getFilteredDemandSlips(filterDate)) 
    }
    else{
      // Get all filter data
      dispatch(getAllDemandSlips())
    }
  }

  useEffect(()=>{
    if(isAdmin || isManager){
      dispatch(getAllDemandSlips())
    }else{
      dispatch(getFilteredDemandSlips())
    }
    dispatch(resetProducts())
  },[])

  // useEffect(()=>{
  //   if(inputDate!==''){
  //     // Get filtered order data
  //     let inputYear = inputDate.slice(0,4)
  //     let inputMonth = inputDate.slice(5,7)
  //     let inputDay = inputDate.slice(8)
  //     let filterDate = inputDay+inputMonth+inputYear
  //     console.log(`formatted Date:${inputDay+inputMonth+inputYear}`)
  //     dispatch(getFilteredDemandSlips(filterDate)) 
  //   }
  // },[inputDate])

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
      <>
      {legendFlag &&
        <>
        <div className="modal-backdrop" ></div> 
        <div className='modal-container'>
            <div className="edit-btn"
                onClick={()=>handleLegendClick()}
            >
            <AiOutlineClose />
            </div>
            <div className='ds-new-box'>
              {prodCodeList.map((item,index)=>{
                return(
                  <p key={index}><span style={{fontWeight:`bold`}}>{item.itemCode}: </span>{item.productName}</p>
                )
              })}
            </div>
        </div>
      </>
      }

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

        <div className={`ds-filter-btn ${legendFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handleLegendClick()}
        >
          Legend        
        </div>


      </div>

      {((isAdmin || isManager)
        && (allFlag||pendingFlag||failedFlag||partialFlag||fulfilledFlag)) 
        &&
        <div className="ds-filter-container"
          style={{height:`auto`, marginBottom:`3vh`}}
        >
        <input
          className='date-input-box'
          type="date"
          onChange={handleDateChange}
          ref={dateInputRef}
        />
        {/* <p>Selected Date: {inputDate}</p> */}
        <div className='ds-filter-btn' onClick={()=>handleDateFilter()}>Search</div>
      </div>
      }
      
      {/* All results count */}
      {!createFlag &&
        <div className="ds-filter-container"
          style={{height:`auto`, marginBottom:`5vh`}}
        >
          {allFlag && 
            <p style={{fontWeight:`bold`}}>Results ({orderData.length})</p>}
          
          {pendingFlag && 
            <p style={{fontWeight:`bold`}}>Results ({orderData.filter((item)=>item.status==='pending').length})</p>}
          
          {failedFlag && 
            <p style={{fontWeight:`bold`}}>Results ({orderData.filter((item)=>item.status==='failed').length})</p>}
          
          {partialFlag && 
            <p style={{fontWeight:`bold`}}>Results ({orderData.filter((item)=>item.status==='partial').length})</p>}
          
          {fulfilledFlag && 
            <p style={{fontWeight:`bold`}}>Results ({orderData.filter((item)=>item.status==='fulfilled').length})</p>}
        
        </div>
      }

      {
        pendingFlag &&
        <div className='ds-filter-container'>
          <p></p>
        </div>
      }

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
                let cardBorder = `none`
                if(order.status==="failed"){cardBorder=`#e26d5c`}
                else if(order.status==="partial"){cardBorder=`#ffef9f`}
                else if(order.status==="fulfilled"){cardBorder=`#a7c957`}
                
                return (
                <div className="ds-slip-box" key={key}
                  style={{backgroundColor:cardBorder}}
                >
                  {(isAdmin||isManager) && 
                    <p><span>Publisher: </span>{order.username}</p>
                  }
                  <p><span>Ticket Number: </span> {order.ticketNumber}</p>
                  <p><span>Delivery Partner Name: </span>{order.deliveryPartnerName}</p>
                  <p><span>Distributor Name: </span> {order.distributorName}</p>
                  <p><span>Status: </span> {order.status}</p>
                  <p><span>Total Cost: </span>{order.totalCost}</p>
                  <p><span>Ordered Products: </span></p>
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
                  {order.status==="partial" &&
                  <>
                  <p><span>Recieved Products: </span></p>
                  <div className='ds-new-col'>
                      {order.recievedProductList?.map((prod,i)=>
                          <React.Fragment key={i}>
                              <p><span>SKU: </span>{prod.sku}</p>
                              <p><span>Full Name: </span>{prod.productFullName}</p>
                              <p><span>Qty: </span>{prod.quantity}</p>
                              <br />
                          </React.Fragment>  
                      )}
                  </div>
                  </>}

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
                  <p><span>Ordered Products: </span></p>
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
                  <p><span>Recieved Products: </span></p>
                  <div className='ds-new-col'>
                      {order.recievedProductList?.map((prod,i)=>
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
        </>
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