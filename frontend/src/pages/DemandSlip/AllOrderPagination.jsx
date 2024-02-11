import React,{useEffect, useState} from 'react'
import DemandSlipCard from '../../components/Cards/DemandSlipCard'
import useAuth from '../../hooks/useAuth'

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DemandSlipEditCard from '../../components/Cards/DemandSlipEditCard';

function AllOrderPagination({dataList, isLoaded, pendingPageFlag=false}) {
    const { isManager } = useAuth()

    const dots = `...`

    const cardsPerPageLimit = 50

    const [currentPage, setCurrentPage] = useState(1)

    const lastIndex = currentPage * cardsPerPageLimit
    const firstIndex = lastIndex - cardsPerPageLimit

    const displayDataList = dataList.slice(firstIndex, lastIndex)

    const numPages = Math.ceil(dataList.length / cardsPerPageLimit)

    const nums = [...Array(numPages+1).keys()].slice(1)

    const [paginationArray, setPaginationArray] = useState([])

    ////////////////////////////////////////////////////
    ////////////////Functions///////////////////////////
    ////////////////////////////////////////////////////
    const handlePrevClick=()=>{
        if(currentPage!==1){
            setCurrentPage(currentPage-1)
        }else{
            setCurrentPage(1)
        }
    }

    const handleNextClick=()=>{
        if(currentPage!==numPages){
            setCurrentPage(currentPage+1)
        }else{
            setCurrentPage(numPages)
        }
    }

    const handleCurrentClick=(pageNum)=>{
        setCurrentPage(pageNum)
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

        setCurrentPage(1)

    },[isLoaded, dataList])

    useEffect(()=>{
        // console.log(`currentPage:${currentPage}`)
        // console.log(`lastIndex:${lastIndex}`)
        // console.log(`firstIndex:${firstIndex}`)
        
        if(numPages<8){
            setPaginationArray(nums)
        }
        else{   
            if(currentPage<=3){
                // console.log(`left`)
                let leftPageNumArray = Array.from(Array(5), (_, i) => i+currentPage)
                setPaginationArray([...leftPageNumArray, dots, numPages])
            }
            else if(currentPage>3 && numPages-currentPage>4 ){
                // console.log(`mid`)
                let middlePageNumArray = Array.from(Array(3), (_, i) => i+currentPage-1)
                setPaginationArray([1,dots,...middlePageNumArray, dots, numPages])
            }else if(numPages-currentPage<=4){
                // console.log(`right`)
                let rightPageNumArray = Array.from(Array(5), (_, i) => i+numPages-4)
                setPaginationArray([1, dots, ...rightPageNumArray])
            }
        }
    },[currentPage])
    
    // useEffect(()=>{
    //     console.log(JSON.stringify(paginationArray,null,4))
    // },[paginationArray])
    

  return (
    <>
    {/* Pagination Bars */}
    {numPages>1 &&
    <div className="ds-filter-container"
        style={{height:`auto`, 
            marginBottom:`3vh`
        }}
    >
        <div className="ds-pagination-container">
            
            {/* Previous Btn */}
            <div className={`ds-page-btn ${currentPage!==1?``:`ds-page-inactive`}`} 
                onClick={()=>handlePrevClick()}
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
                onClick={()=>handleNextClick()}
            >
                <FaAngleRight style={{fontSize:`1rem`}}/>
            </div>

        </div>
    </div>
    }

    {/* Cards */}
    <div className="ds-filter-data-container">
        <div className="ds-content ds-card-content">
        {displayDataList.length>0 &&
            displayDataList.map((order,key)=>{
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