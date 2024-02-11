import React, { useState, useEffect, useRef } from 'react'
import { FaAngleDown } from "react-icons/fa6";
import "./Dropdown.css"

function UserDropdown({value, dataList, passUsername}) {
    const boxRef = useRef(null) 

    const [isActive, setIsActive] = useState(false)
    const [selectedItem, setSelectedItem] = useState("")

    const handleClick=()=>{
        setIsActive(!isActive)
    }

    const handleItemClick=(user)=>{
        const data = user

        passUsername(data)
        setSelectedItem(user)
        setIsActive(!isActive)
    }

    useEffect(()=>{
        setSelectedItem(value)
    },[value])

    // Modal close
    useEffect(()=>{
        let handler = (event) => {
            if(!boxRef.current.contains(event.target)
               )
              {
                setIsActive(false)
              }
        };
        document.addEventListener("mousedown", handler);
    
        return()=>{
        document.removeEventListener("mousedown",handler);
        }
    })

  return (
    <div className="drop-down-container no-border-dropdown-container" ref={boxRef}>
        <div className="drop-down-item selected-drop-down" onClick={()=>handleClick()}>
            <p>{selectedItem===""?`Select a User`:selectedItem}</p>
            <div className='arrow-container'>
            <FaAngleDown className='down-arrow' />
            </div>
        </div>     

        {isActive && 
        <div className="drop-down-list-container no-border-dropdown-list">
            {dataList?.map((item,index)=>
            <div className="drop-down-item" key={index}
                onClick={()=>handleItemClick(item)}
            >
                <p>{item}</p>
            </div>
            )
            }

        </div>
        }     
    </div>
  )
}

export default UserDropdown