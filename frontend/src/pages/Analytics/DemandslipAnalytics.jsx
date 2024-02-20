import React, { useEffect, useRef, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Chart as ChartJS } from "chart.js/auto"
import { Line } from "react-chartjs-2"

import useAuth from '../../hooks/useAuth'
import { getDemandslipAggregateData } from '../../features/analytics/analyticsSlice'

import "./Analytics.css"

function DemandslipAnalytics() {
  const dispatch = useDispatch()

  const { isAdmin, isManager } = useAuth()

  const dateInputRef = useRef(null);
  const toDateInputRef = useRef(null);

  const { demandSlipData } = useSelector((state)=>state.analytics)

  const [filterParams,setFilterParams] = useState({
    rawDate:'',
    rawToDate:'',
    filterDate:'',
    filterToDate:'',
    // filterPublisherUsername:'',
    // filterStatus:'',
    // filterTicketNum:'',
    accessLevel: isManager
  })

  ///////////////////////////////////////////////////////
  /////////////////////Functions/////////////////////////
  ///////////////////////////////////////////////////////
  const handleDemandSlipData=()=>{
  }

  const onFilterChange=(e)=>{
    if(e.target.name==='rawDate'){
      const fD = handleDateFilter(e.target.value)

      setFilterParams((prevState)=>({
          ...prevState,
          filterDate:fD
      }))
    }
    else if(e.target.name==='rawToDate'){
      const tD = handleDateFilter(e.target.value)

      setFilterParams((prevState)=>({
          ...prevState,
          filterToDate:tD
      }))
    }
    
    setFilterParams((prevState)=>({
      ...prevState,
      [e.target.name]:e.target.value
    }))
  }

  const handleFilterClear =()=>{
    setFilterParams({
      rawDate:'',
      rawToDate:'',
      filterDate:'',
      filterToDate:'',
      // filterPublisherUsername:'',
      // filterStatus:'',
      // filterTicketNum:'',
      accessLevel: isManager
    })

    // setFilterUsername('')
  }

  const handleDateFilter=(rawData)=>{
    if(rawData!==''){
      // Get filtered order data
      let inputYear = rawData.slice(0,4)
      let inputMonth = rawData.slice(5,7)
      let inputDay = rawData.slice(8)
      let formatterFilterDate = inputDay+inputMonth+inputYear
      
      return formatterFilterDate
    }
  }

  const handleFilterSearch =()=>{
    if(filterParams.filterDate!=='' 
      && filterParams.filterToDate!=''
      &&(filterParams.rawDate>filterParams.rawToDate)){
        return alert('Invalid Dates: Start Date cannot be greater than End Date')
    }
    if(filterParams.filterDate==='' && filterParams.filterToDate!==''){
      return alert('Invalid Dates: Enter from date')
    }

    dispatch(getDemandslipAggregateData(filterParams))
  }
  
  ///////////////////////////////////////////////////////
  ///////////////////////Hooks///////////////////////////
  ///////////////////////////////////////////////////////
  useEffect(()=>{
    let today = new Date()
    let weekBack =  new Date(today.getTime()-7*24*60*60*1000)



    dispatch(getDemandslipAggregateData())
  },[])

  return (
    <>
    <div className='container' >
    <div className="ds-filter-container"
          style={{height:`auto`, marginBottom:`3vh`}}
          >

        {(isAdmin || isManager) && 
        <>
          {/* Filter Date Input */}
          <label htmlFor="rawDate" className='date-input-label'>
            Start Date
          </label>
          <input
            className='date-input-box'
            name='rawDate'
            type="date"
            value={filterParams.rawDate}
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
            value={filterParams.rawToDate}
            onChange={onFilterChange}
            ref={toDateInputRef}
          />

          {/* Username Dropdown button */}
          {/* <div className='ds-filter-dropdown-container'>
            <UserDropdown
              value={filterUsername} 
              dataList={usernameList} 
              passUsername={setFilterUsername}
              />
          </div> */}
        </>
        }

        {/* Ticket Number Search*/}
          {/* <input 
            className='ds-filter-form-control'
            type='text'
            name='filterTicketNum'
            placeholder="Ticket Number"
            value={filterParams.filterTicketNum}
            onChange={handleNumField}
          /> */}

        {/* Filter Submit Button */}
        <div className='ds-filter-btn' onClick={()=>handleFilterSearch()}>Search</div>
      
        {/* Clear Filter Button */}
        <div className='ds-filter-btn' onClick={()=>handleFilterClear()}>Clear</div>
      
      </div>

      <div className="ds-filter-data-container">

            <div className="graph-container">
              <Line 
                data={{
                  labels: demandSlipData?.map((point)=>point.dateString),
                  datasets:[{
                    label:"Demand Slip Expenditure",
                    data: demandSlipData?.map((point)=>point.totalCost),
                    backgroundColor:["rgba(61,157,143,1)"],
                    borderColor:["rgba(61,157,143,0.5)"]
                  }
                ]
              }}
              />
            </div>

          </div>

      {/* </div> */}
    </div>
    </>
  )
}

export default DemandslipAnalytics