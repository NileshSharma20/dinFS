import React,{useEffect, useState} from 'react'
import DemandSlipCard from '../../components/Cards/DemandSlipCard'
import useAuth from '../../hooks/useAuth'

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DemandSlipEditCard from '../../components/Cards/DemandSlipEditCard';
import { useDispatch, useSelector } from 'react-redux';
import { getFilteredDemandSlips } from '../../features/orders/orderSlice';

function AllOrderPagination({
    dataList, 
    isLoaded, 
    pendingPageFlag=false,
    cardsPerPageLimit,
    filterParams
}
) {

    const dispatch = useDispatch()
    
    const { isManager } = useAuth()

    const { 
        pageCount,
        currentPage } = useSelector((state)=>state.orders)

    const dots = `...`

    // const cardsPerPageLimit = 2

    const [numPages, setNumPages] = useState(1)

    const nums = [...Array(numPages+1).keys()].slice(1)

    const [paginationArray, setPaginationArray] = useState([])

    // const [filterStatusString, setfilterStatusString]=useState(null)

    ////////////////////////////////////////////////////
    ////////////////Functions///////////////////////////
    ////////////////////////////////////////////////////
    const handlePrevClick=()=>{
        if(currentPage!==1){
            // setCurrentPage(currentPage-1)
            dispatch(getFilteredDemandSlips({
                ...filterParams,
                page:currentPage-1,
                limit:cardsPerPageLimit,
                // filterStatus
            }))
        }else{
            // setCurrentPage(1)
            dispatch(getFilteredDemandSlips({
                ...filterParams,
                page:1,
                limit:cardsPerPageLimit,
                // filterStatus
            }))
        }
    }

    const handleNextClick=()=>{
        // if(currentPage!==numPages){
        if(currentPage<pageCount){
            dispatch(getFilteredDemandSlips({
                ...filterParams,
                page:currentPage+1,
                limit:cardsPerPageLimit,
                // filterStatus
            }))
        }else if(currentPage===pageCount){
            // setCurrentPage(pageCount)
            dispatch(getFilteredDemandSlips({
                ...filterParams,
                page:pageCount,
                limit:cardsPerPageLimit,
                // filterStatus
            }))
        }
    }

    const handleCurrentClick=(pageNum)=>{
        dispatch(getFilteredDemandSlips({
            ...filterParams,
            page:pageNum,
            limit:cardsPerPageLimit,
            // filterStatus
        }))
    }

    ////////////////////////////////////////////////////
    ////////////////Hooks///////////////////////////////
    ////////////////////////////////////////////////////

    useEffect(()=>{
        if(numPages<8){
            setPaginationArray(nums)
        }else{
            let leftPageNumArray = Array.from(Array(5), (_, i) => i+1)
            setPaginationArray([...leftPageNumArray, dots, numPages])
        }

    },[isLoaded, dataList, numPages])

    useEffect(()=>{        
        if(numPages<8){
            setPaginationArray(nums)
        }
        else{   
            if(currentPage<=3){
                let leftPageNumArray = Array.from(Array(5), (_, i) => i+currentPage)
                setPaginationArray([...leftPageNumArray, dots, numPages])
            }
            else if(currentPage>3 && numPages-currentPage>4 ){
                let middlePageNumArray = Array.from(Array(3), (_, i) => i+currentPage-1)
                setPaginationArray([1,dots,...middlePageNumArray, dots, numPages])
            }
            else if(numPages-currentPage<=4){
                let rightPageNumArray = Array.from(Array(5), (_, i) => i+numPages-4)
                setPaginationArray([1, dots, ...rightPageNumArray])
            }
        }
    },[currentPage])

    useEffect(()=>{
        let pC = pageCount || 1
        setNumPages(pC)
        // console.log(`pageCount:${pageCount}`)
    },[pageCount])
        

  return (
    <>
    {/* Pagination Bars */}
    {numPages>1 && dataList.length!==0 &&
    <div className="ds-filter-container"
        style={{height:`auto`, 
            marginBottom:`3vh`
        }}
    >
        <div className="ds-pagination-container">
            
            {/* Previous Btn */}
            <div className={`ds-page-btn ${currentPage!==1?``:`ds-page-inactive`}`} 
                onClick={(currentPage!==1) ? (()=>handlePrevClick()): undefined}
            >
                <FaAngleLeft style={{fontSize:`1rem`}}/>
            </div>

            {/* Pagination Numbers */}
            {paginationArray.map((number,index)=>{
                return(
                    <React.Fragment key={index}>
                        {number===dots? 
                        <div className={`ds-page-btn ds-page-inactive`}
                            style={{color:`black`}}
                        >
                            {number}
                        </div>
                        :
                        <div className={`ds-page-btn 
                            ${number===currentPage?"ds-page-btn-active":""}
                            `} 
                            onClick={()=>handleCurrentClick(number)}
                            >
                            {number}
                        </div>
                        }
                    </React.Fragment>
                )
            })
            }

            {/* Next Btn */}
            <div className={`ds-page-btn ${currentPage!==numPages?``:`ds-page-inactive`}`} 
                onClick={(currentPage!==pageCount) ? (()=>handleNextClick()):undefined}
            >
                <FaAngleRight style={{fontSize:`1rem`}}/>
            </div>

        </div>
    </div>
    }

    {/* Cards */}
    <div className="ds-filter-data-container">
        <div className="ds-content ds-card-content">
        {dataList.length>0 &&
            dataList.map((order,key)=>{
            return (
                <React.Fragment key={key}>
                    {
                        pendingPageFlag?
                        <DemandSlipEditCard info={order}/>
                        :
                        <DemandSlipCard info={order}
                            partialFlag={order.status==='partial'}
                        />
                    }
                </React.Fragment>
                )
            })
            
        }
        {isLoaded && dataList.length===0 &&

            <div style={{gridColumn:"1/span 3"}}>
                <h1>No Orders {isManager?`Today`:``}</h1>
            </div>
        }
        
        </div>
    
    </div>


    <br />

    {/* Pagination Bars */}
    {numPages>1 &&
    <div className="ds-filter-container"
        style={{height:`auto`, 
            marginBottom:`3vh`
        }}
    >
        <div className="ds-pagination-container">

            
            <div className={`ds-page-btn ${currentPage!==1?``:`ds-page-inactive`}`} onClick={()=>handlePrevClick()}>
                <FaAngleLeft style={{fontSize:`1rem`}}/>
            </div>

            {paginationArray.map((number,index)=>{
                return(
                    <React.Fragment key={index}>
                        {number===dots? 
                        <div className={`ds-page-btn ds-page-inactive`}
                            style={{color:`black`}}
                        >
                            {number}
                        </div>
                        :
                        <div className={`ds-page-btn 
                            ${number===currentPage?"ds-page-btn-active":""}
                            `} 
                            onClick={()=>handleCurrentClick(number)}
                            >
                            {number}
                        </div>
                        }
                    </React.Fragment>
                )
            })
            }

            <div className={`ds-page-btn ${currentPage!==numPages?``:`ds-page-inactive`}`} onClick={()=>handleNextClick()}>
                <FaAngleRight style={{fontSize:`1rem`}}/>
            </div>
        </div>
    </div>
    }
    </>
  )
}

export default AllOrderPagination