import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'

import debouce from "lodash.debounce";


import "./Modal.css"

function LegendModal({data, setFlag, flag}) {
    const modalRef = useRef(0)

    const [searchKey, setSearchKey] = useState("")
    const [filteredData, setFilteredData] = useState([...data])

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    const handleLegendClick=()=>{
        setFlag(false)
    }

    const handleSearchChange = (e) => {
        setSearchKey(e.target.value);
    }

    // Debounce function
    const debouncedResults = debouce(handleSearchChange, 800)

    const onChange=(e)=>{
        // e.preventDefault()
        setSearchKey(e.target.value)
    }

    /////////////////////////////////////////////////
    /////////// Hooks ///////////////////////////////
    ////////////////////////////////////////////////

    //Pop up handling
    useEffect(()=>{
        let handler = (event) => {
            if(flag && !modalRef.current.contains(event.target) 
            )
            {
                setFlag(false) 
            }
        };
        document.addEventListener("mousedown", handler);

        return()=>{
        document.removeEventListener("mousedown",handler);
        }
    })

    //Check
    useEffect(()=>{
        let cleanedSearchKey = searchKey.trim() 
        cleanedSearchKey = cleanedSearchKey.replace(/ /g,"-")
        console.log(`searchKey: ${cleanedSearchKey}`)

        if(cleanedSearchKey===""){
            return setFilteredData(data)
        }else{

            let regExp = new RegExp(cleanedSearchKey, 'gi') 
            
            let fD = data.filter((x)=>
                    x.itemCode.match(regExp) || 
                x.productName.match(regExp)
            )
            
            setFilteredData(fD)
        }

        // console.log(`fD:${JSON.stringify(fD,null,4)}`)
    },[searchKey])

    // Debounce Search
    useEffect(() => {
        return () => {
        debouncedResults.cancel();
        };
    });
  
    return (
    <>
        <div className="modal-backdrop" ></div> 
        <div className='legend-modal-container' ref={modalRef}>
            
            <div className="edit-btn legend-close-btn"
                onClick={()=>handleLegendClick()}
            >
            <AiOutlineClose />
            </div>

            <div className="ds-search-input-box" >
                    
                    <div className="search-bar">
                        <AiOutlineSearch className='search-icon'/>
                        <input
                        type="text"
                        name="search"
                        placeholder="Search for Item Code"
                        onChange={debouncedResults}
                        autoComplete='off'
                        />

                    </div>

            </div>

            {filteredData.length===0?
                <h1>No Item Found</h1>
                :
                <div className='ds-prodList-box'>
              {filteredData.map((item,index)=>(
                
                  <div className='ds-prodList-col' key={index}>

                    <div className='ds-prodList-itemCode' >
                      <span>{index+1}. </span>
                      <span style={{fontWeight:`bold`}}>
                        {item.itemCode}: 
                        </span>
                    </div>
                    <div>

                        {item.productName}
                    </div>
                  </div>
                
              )
              )}
            </div>}
        </div>
      </>
  )
}

export default LegendModal