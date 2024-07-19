import React, { useEffect, useState, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import QuickProdSearchForm from '../../components/Forms/QuickProdSearchForm'
import UserDropdown from '../../components/Dropdown/UserDropdown'
import Loader from '../../components/Loader/Loader'
import LoginAgainModal from '../../components/Modals/LoginAgainModal'
import AllOrderPagination from './AllOrderPagination'

import { getFilteredDemandSlips } from '../../features/orders/orderSlice'
import { resetProducts } from '../../features/products/productSlice'
import { getAllUsers } from '../../features/users/usersSlice'
// 
import useAuth from '../../hooks/useAuth'

// import UserDropdown from "../../components/Dropdown/UserDropdown"
import "./DemandSlip.css"
import LegendModal from '../../components/Modals/LegendModal'
import DataStatusDropdown from '../../components/Dropdown/DataStatusDropdown'

function DemandSlip() {
  const dispatch = useDispatch()

  const { isAdmin, isManager, isAccountant } = useAuth()
  
  const dateInputRef = useRef(null);
  const toDateInputRef = useRef(null);

  const {token} = useSelector((state)=>state.auth)

  const {prodCodeList} = useSelector((state)=>state.product)
  
  const {usersList} = useSelector((state)=>state.users)

  const { orderData,
          totalDataLength,
          isSuccess,
          isLoading } = useSelector((state)=>state.orders)

  const usernameList = [`all`, ...usersList.map(user=>user.username)]

  const [createFlag, setCreateFlag] = useState(false)
  const [allFlag, setAllFlag] = useState(true)
  const [pendingFlag, setPendingFlag] = useState(false)
  const [fulfilledFlag, setFulfilledFlag] = useState(false)
  const [failedFlag, setFailedFlag] = useState(false)
  const [partialFlag, setPartialFlag] = useState(false)
  // const [incompleteFlag, setIncompleteFlag] = useState(false)

  const [legendFlag, setLegendFlag] = useState(false)
  
  const currDate = new Date()
  let currDay = currDate.getDate()
  let currMonth = currDate.getMonth()+1
  let currYear = currDate.getFullYear()

  if(currDay<10){
    currDay = '0'+currDay
  }

  if(currMonth<10){
    currMonth = '0'+currMonth
  }

  const currDateString = currYear+"-"+currMonth+"-"+currDay
  const currentDateStart = new Date(currDateString)

  let weekAgoDate = new Date(currentDateStart - 7 * 24 * 60 * 60 * 1000)

  let weekAgoDay = weekAgoDate.getDate()
  let weekAgoMonth = weekAgoDate.getMonth()+1
  let weekAgoYear = weekAgoDate.getFullYear()

  if(weekAgoDay<10){
    weekAgoDay = '0'+weekAgoDay
  }

  if(weekAgoMonth<10){
    weekAgoMonth = '0'+weekAgoMonth
  }

  const weekAgoDateString = weekAgoYear+"-"+weekAgoMonth+"-"+weekAgoDay

  const [filterParams,setFilterParams] = useState({
    rawDate:'',
    rawToDate:'',
    filterDate:'',
    filterToDate:'',
    filterPublisherUsername:'',
    filterStatus:'',
    filterDataStatus:'incomplete',
    // filterDataStatus:'',
    filterTicketNum:'',
    accessLevel: isAccountant
  })

  const pageLimit = 50

  const [filterUsername, setFilterUsername] = useState('')
  // const [filterDataStatus, setFilterDataStatus] = useState('')

  /////////////////////////////////////////////////
  //////// Functions /////////////////////////////
  ////////////////////////////////////////////////

  const handleLegendClick=()=>{
    setLegendFlag(!legendFlag)
  }

  const onFilterChange=(e)=>{
    // console.log(`name:${e.target.name}\nvalue:${e.target.value}`)
    if(e.target.name==='rawDate'){
      const fD = handleDateFilter(e.target.value)

      return setFilterParams((prevState)=>({
          ...prevState,
          rawDate:e.target.value,
          filterDate:fD
      }))
    }
    else if(e.target.name==='rawToDate'){
      const tD = handleDateFilter(e.target.value)

      return setFilterParams((prevState)=>({
          ...prevState,
          rawToDate:e.target.value,
          filterToDate:tD
      }))
    }
    
    setFilterParams((prevState)=>({
      ...prevState,
      [e.target.name]:e.target.value
    }))
  }

  const handleNumField = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFilterParams((prevState)=>({...prevState, [e.target.name]:value}));
  };

  const handleFilterClear =()=>{
    setFilterParams({
      rawDate:'',
      rawToDate:'',
      filterDate:'',
      filterToDate:'',
      filterPublisherUsername:'',
      filterStatus:'',
      filterDataStatus:'',
      filterTicketNum:'',
      accessLevel: isAccountant
    })

    setFilterUsername('')

    pendingFlag && setFilterParams((prevState)=>({...prevState,filterStatus:'pending'})) 
    partialFlag && setFilterParams((prevState)=>({...prevState,filterStatus:'partial'})) 
    failedFlag && setFilterParams((prevState)=>({...prevState,filterStatus:'failed'})) 
    fulfilledFlag && setFilterParams((prevState)=>({...prevState,filterStatus:'fulfilled'})) 
    // setFilterDataStatus('')
  }

  const handleFilterSearch =()=>{
    if(filterParams.filterDate!=='' 
      && filterParams.filterToDate!==''
      &&(filterParams.rawDate>filterParams.rawToDate)){
        return alert('Invalid Dates: Start Date cannot be greater than End Date')
    }
    if(filterParams.filterDate==='' && filterParams.filterToDate!==''){
      return alert('Invalid Dates: Enter from date')
    }

    dispatch(getFilteredDemandSlips(filterParams))
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
    setFilterParams((prevState)=>(
      {...prevState, 
        filterStatus:''
      }))
    
    dispatch(getFilteredDemandSlips(
      {...filterParams,
        filterStatus:'',
        page:1,
        limit:pageLimit
      }
    ))

    
    setCreateFlag(false)
    setFailedFlag(false)
    setPartialFlag(false)
    setPendingFlag(false)
    setFulfilledFlag(false)
    
    
    setAllFlag(true)
  }
  
  const handlePendingClick=()=>{
    setFilterParams((prevState)=>(
      {...prevState, 
        filterStatus:'pending'
      }))

    dispatch(getFilteredDemandSlips(
      {...filterParams,
        filterStatus:'pending',
        page:1,
        limit:pageLimit
      }
    ))

    setCreateFlag(false)
    setAllFlag(false)
    setFailedFlag(false)
    setPartialFlag(false)
    setFulfilledFlag(false)
    
    
    setPendingFlag(true)
  }
  
  const handlePartialClick=()=>{
    setFilterParams(((prevState)=>({...prevState, filterStatus:'partial'})))
    dispatch(getFilteredDemandSlips(
      {...filterParams,
        filterStatus:'partial',
        page:1,
        limit:pageLimit
      }
    ))
      
    setCreateFlag(false)
    setAllFlag(false)
    setPendingFlag(false)
    setFailedFlag(false)
    setFulfilledFlag(false)
    
    
    setPartialFlag(true)
    }
  
  const handleFailedClick=()=>{
    setFilterParams(((prevState)=>({...prevState, filterStatus:'failed'})))
    dispatch(getFilteredDemandSlips(
      {...filterParams,
        filterStatus:'failed',
        page:1,
        limit:pageLimit
      }
    ))

    setCreateFlag(false)
    setAllFlag(false)
    setPendingFlag(false)
    setPartialFlag(false)
    setFulfilledFlag(false)
    
    
    setFailedFlag(true)

    
  }
  
  const handleFulfilledClick=()=>{
    setFilterParams(((prevState)=>({...prevState, filterStatus:'fulfilled'})))
    dispatch(getFilteredDemandSlips(
      { ...filterParams,
        filterStatus:'fulfilled',
        page:1,
        limit:pageLimit
      }
    ))

    setCreateFlag(false)
    setAllFlag(false)
    setPendingFlag(false)
    setFailedFlag(false)
    setPartialFlag(false)
    
    
    setFulfilledFlag(true)
  }

  // const handleIncompleteClick=()=>{
  //   setFilterParams(((prevState)=>({...prevState,filterStatus:'', filterDataStatus:'incomplete'})))
  //   dispatch(getFilteredDemandSlips(
  //     { ...filterParams,
  //       filterStatus:'',
  //       filterDataStatus:'incomplete',
  //       page:1,
  //       limit:pageLimit
  //     }
  //   ))

  //   setCreateFlag(false)
  //   setAllFlag(false)
  //   setPendingFlag(false)
  //   setFailedFlag(false)
  //   setPartialFlag(false)
  //   setFulfilledFlag(false)
    
  //   setIncompleteFlag(true)
  // }
  
  // const handleLegendClick=()=>{
  //   setLegendFlag(!legendFlag)
  // }
  
  const handleDateFilter=(rawData)=>{
    if(rawData!==''){
      // Get filtered order data
      let inputYear = rawData.slice(0,4)
      let inputMonth = rawData.slice(5,7)
      let inputDay = rawData.slice(8)
      let formatterFilterDate = inputDay+inputMonth+inputYear
      
      // console.log(formatterFilterDate)

      return formatterFilterDate      
    }
  }
  
  ///////////////////////////////////////////////////////
  ///////////////////////Hooks///////////////////////////
  ///////////////////////////////////////////////////////
  
  // Reset Prod Search Results and Load Demand Slips
  useEffect(()=>{
    if(isAdmin || isManager || isAccountant){
      dispatch(getAllUsers())
    }    
    dispatch(resetProducts())
  },[])
  
  // Set Filter Username
  useEffect(()=>{
    if(filterUsername!=='all'){
      setFilterParams((prevState)=>({
        ...prevState,
        filterPublisherUsername:filterUsername
      }))
    }else{
      setFilterParams((prevState)=>({
        ...prevState,
        filterPublisherUsername:''
      }))
    }

  },[filterUsername])

  // Set Filter Data Status
  // useEffect(()=>{
  //   if(filterDataStatus!=='all'){
  //     setFilterParams((prevState)=>({
  //       ...prevState,
  //       filterDataStatus:filterDataStatus
  //     }))
  //   }else{
  //     setFilterParams((prevState)=>({
  //       ...prevState,
  //       filterDataStatus:''
  //     }))
  //   }

  // },[filterDataStatus])

  return (
    <>
    {!token && <LoginAgainModal />}
    {isLoading && <Loader/>}
    <div className='container' 
      style={{ 
        justifyContent:"flex-start",
      }}
    >
      <>
      {legendFlag 
        &&
        <LegendModal 
          data={prodCodeList} 
          setFlag={setLegendFlag} 
          flag={legendFlag}
        />
      //   <>
      //   <div className="modal-backdrop" ></div> 
      //   <div className='legend-modal-container' ref={modalRef}>
            
      //       <div className="edit-btn legend-close-btn"
      //           onClick={()=>handleLegendClick()}
      //       >
      //       <AiOutlineClose />
      //       </div>

      //       <div className='ds-prodList-box'>
      //         {prodCodeList.map((item,index)=>(
                
      //             <div className='ds-prodList-col' key={index}>

      //               <div className='ds-prodList-itemCode' >
      //                 <span>{index+1}. </span>
      //                 <span style={{fontWeight:`bold`}}>
      //                   {item.itemCode}: 
      //                   </span>
      //               </div>
      //               <div>

      //                   {item.productName}
      //               </div>
      //             </div>
                
      //         )
      //         )}
      //       </div>
      //   </div>
      // </>
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

        {/* <div className={`ds-filter-btn ${incompleteFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handleIncompleteClick()}
        >
          Incomplete        
        </div> */}

        <div className={`ds-filter-btn ${legendFlag?"ds-filer-btn-active":""}`}
          onClick={()=>handleLegendClick()}
        >
          Legend        
        </div>


      </div>

      {(allFlag||pendingFlag||failedFlag||partialFlag||fulfilledFlag
        // ||incompleteFlag
      ) 
        &&
        <>

        <div className="ds-filter-container"
          style={{height:`auto`, marginBottom:`3vh`}}
          >

        {(isAdmin || isManager || isAccountant) && 
        <>
          {/* Filter Date Input */}
          <label htmlFor="rawDate" className='date-input-label'>
            Start Date
          </label>
          <input
            className='date-input-box'
            name='rawDate'
            type="date"
            max={currDateString}
            min={(isAccountant && !isManager)? weekAgoDateString:""}
            value={filterParams.rawDate}
            // value={filterParams.filterDate}
            onChange={onFilterChange}
            ref={dateInputRef}
          />

          <label htmlFor="rawToDate" className='date-input-label'>
            End Date
          </label>
          <input
            className='date-input-box'
            name='rawToDate'
            type="date"
            max={currDateString}
            min={filterParams.rawDate?filterParams.rawDate:""}
            value={filterParams.rawToDate}
            onChange={onFilterChange}
            ref={toDateInputRef}
          />

          {/* Username Dropdown button */}
          <div className='ds-filter-dropdown-container'>
            <UserDropdown
              value={filterUsername} 
              dataList={usernameList} 
              passUsername={setFilterUsername}
              />
          </div>
        </>
        }
        </div>

        <div className="ds-filter-container"
          style={{height:`8vh`, marginBottom:`5vh`}}
        >
          
          {/* Data Status Dropdown button */}
          {/* {!incompleteFlag && */}
          <div className='ds-filter-dropdown-container'>
            <DataStatusDropdown
              value={filterParams.filterDataStatus} 
              dataList={['all','complete','incomplete']} 
              passDataStatus={setFilterParams}
              />
          </div>
          {/* } */}

        {/* Ticket Number Search*/}
          <input 
            className='ds-filter-form-control'
            type='text'
            name='filterTicketNum'
            placeholder="Ticket Number"
            value={filterParams.filterTicketNum}
            onChange={handleNumField}
          />

        {/* Filter Submit Button */}
        <div className='ds-filter-btn' onClick={()=>handleFilterSearch()}>Search</div>
      
        {/* Clear Filter Button */}
        <div className='ds-filter-btn' onClick={()=>handleFilterClear()}>Clear</div>
      
      </div>

      </>
    }
      
      {/* All results count */}
      {!createFlag &&
        <div className="ds-filter-container"
          style={{height:`auto`, marginBottom:`5vh`}}
        >
          <p style={{fontWeight:`bold`}}>Results ({totalDataLength})</p>  
        </div>
      }

        {createFlag &&
        <div className="ds-filter-data-container">
        
          {/* Create Demand Slip */}
          <>
          <div className="ds-content"
          >
          <div className="ds-search-container">
              <QuickProdSearchForm setToggleFlag={setCreateFlag} passNextFlag={setPendingFlag} />
          </div>
          </div>

          </>
        </div>
        }
        

        {/* Orders */}
        {!createFlag && !pendingFlag &&
        <AllOrderPagination 
          dataList={orderData} 
          isLoaded={isSuccess}
          filterParams={filterParams}
          cardsPerPageLimit={pageLimit}
        />
        }

        {/* Pending Orders */}
        {!createFlag && pendingFlag &&
        <AllOrderPagination 
          dataList={orderData} 
          isLoaded={isSuccess}
          pendingPageFlag={true}
          filterParams={filterParams}
          cardsPerPageLimit={pageLimit}
        />
        }
        </>
    </div>
    </>
  )
} 

export default DemandSlip