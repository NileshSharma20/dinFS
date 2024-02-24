import React, { useEffect, useState, useRef } from 'react'

import "./DemandSlip.css"
import QuickProdSearchForm from '../../components/Forms/QuickProdSearchForm'
import { useDispatch, useSelector } from 'react-redux'
import { getAllDemandSlips, getFilteredDemandSlips } from '../../features/orders/orderSlice'
import Loader from '../../components/Loader/Loader'
import LoginAgainModal from '../../components/Modals/LoginAgainModal'
import useAuth from '../../hooks/useAuth'
import { resetProducts } from '../../features/products/productSlice'
import { AiOutlineClose } from 'react-icons/ai'
import { getAllUsers } from '../../features/users/usersSlice'
// import UserDropdown from '../../components/Dropdown/UserDropdown'
import UserDropdown from "../../components/Dropdown/UserDropdown"
import AllOrderPagination from './AllOrderPagination'

function DemandSlip() {
  const dispatch = useDispatch()

  const { isAdmin, isManager } = useAuth()
  
  const dateInputRef = useRef(null);

  const {token} = useSelector((state)=>state.auth)

  const {prodCodeList} = useSelector((state)=>state.product)
  
  const {usersList} = useSelector((state)=>state.users)

  const { orderData,
          totalDataLength,
          isSuccess,
          isLoading } = useSelector((state)=>state.orders)

  const usernameList = [`all`, ...usersList.map(user=>user.username)]

  const [createFlag, setCreateFlag] = useState(true)
  const [allFlag, setAllFlag] = useState(false)
  const [pendingFlag, setPendingFlag] = useState(false)
  const [fulfilledFlag, setFulfilledFlag] = useState(false)
  const [failedFlag, setFailedFlag] = useState(false)
  const [partialFlag, setPartialFlag] = useState(false)

  const [legendFlag, setLegendFlag] = useState(false)

  const [filterParams,setFilterParams] = useState({
    rawDate:'',
    filterDate:'',
    filterPublisherUsername:'',
    filterStatus:'',
    filterTicketNum:'',
    accessLevel: isManager
  })

  const pageLimit = 50

  const [filterUsername, setFilterUsername] = useState('')

  /////////////////////////////////////////////////
  //////// Functions /////////////////////////////
  ////////////////////////////////////////////////

  const onFilterChange=(e)=>{
    if(e.target.name==='rawDate'){
      const fD = handleDateFilter(e.target.value)
      // console.log(`fD:${fD}`)

      setFilterParams((prevState)=>({
          ...prevState,
          filterDate:fD
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
      filterDate:'',
      filterPublisherUsername:'',
      filterStatus:'',
      filterTicketNum:'',
      accessLevel: isManager
    })

    setFilterUsername('')
  }

  const handleFilterSearch =()=>{
    // console.log(`filterParams:${JSON.stringify(filterParams,null,4)}`)
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
  
  const handleLegendClick=()=>{
    setLegendFlag(!legendFlag)
  }
  
  const handleDateFilter=(rawData)=>{
    if(rawData!==''){
      // Get filtered order data
      let inputYear = rawData.slice(0,4)
      let inputMonth = rawData.slice(5,7)
      let inputDay = rawData.slice(8)
      let formatterFilterDate = inputDay+inputMonth+inputYear
      
      return formatterFilterDate
      // console.log(`formatted Date:${inputDay+inputMonth+inputYear}`)
      // dispatch(getFilteredDemandSlips(filterDate)) 
    }
  }
  
  ///////////////////////////////////////////////////////
  ///////////////////////Hooks///////////////////////////
  ///////////////////////////////////////////////////////
  
  // Reset Prod Search Results and Load Demand Slips
  useEffect(()=>{
    if(isAdmin || isManager){
      // dispatch(getAllDemandSlips())
      dispatch(getAllUsers())
    }
    // else{
    //   dispatch(getFilteredDemandSlips())
    // }
    
    dispatch(resetProducts())

    // console.log(JSON.stringify(({...filterParams, filterStatus:'p'}),null,4))
    
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

      {(allFlag||pendingFlag||failedFlag||partialFlag||fulfilledFlag) 
        &&
        <div className="ds-filter-container"
          style={{height:`auto`, marginBottom:`3vh`}}
          >

        {(isAdmin || isManager) && 
        <>
          {/* Filter Date Input */}
          <input
            className='date-input-box'
            name='rawDate'
            type="date"
            value={filterParams.rawDate}
            onChange={onFilterChange}
            ref={dateInputRef}
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
        

        {/* All Orders */}
        {allFlag &&
        <AllOrderPagination 
          dataList={orderData} 
          isLoaded={isSuccess}
          filterParams={filterParams}
          cardsPerPageLimit={pageLimit}
        />
        }

        {/* Pending Orders */}
        {pendingFlag &&
        <AllOrderPagination dataList={orderData} 
          isLoaded={isSuccess}
          pendingPageFlag={true}
          filterParams={filterParams}
          cardsPerPageLimit={pageLimit}
        />
        }

        {/* Partial Orders */}
        {partialFlag &&
        <AllOrderPagination 
          dataList={orderData} 
          isLoaded={isSuccess}
          filterParams={filterParams}
          cardsPerPageLimit={pageLimit}
        />
        }

        {/* Failed Orders */}
        {failedFlag &&
        <AllOrderPagination 
          dataList={orderData} 
          isLoaded={isSuccess}
          filterParams={filterParams}
          cardsPerPageLimit={pageLimit}
        />
        }

        {/* Fulfilled Orders */}
        {fulfilledFlag &&
        <AllOrderPagination 
          dataList={orderData} 
          isLoaded={isSuccess}
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