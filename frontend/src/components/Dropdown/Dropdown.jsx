import React, { useEffect, useState } from 'react'
import "./Dropdown.css"

function Dropdown({dataList, passItemCode}) {
    const [isActive, setIsActive] = useState(false)
    const [selectedItem, setSelectedItem] = useState("")

    const handleClick=()=>{
        setIsActive(!isActive)
    }

    const handleItemClick=(prod)=>{
        const data = {
            saveFile:false,
            itemCode: prod.code
        }

        passItemCode(data)
        setSelectedItem(prod.name)
        setIsActive(!isActive)
    }

  return (
    <div className="drop-down-container">
        <div className="drop-down-item selected-drop-down" onClick={()=>handleClick()}>
            <p>{selectedItem===""?`Select an Item`:selectedItem}</p>
        </div>     

        {isActive && 
        <div className="drop-down-list-container">
            {dataList?.map((item,index)=>
            <div className="drop-down-item" key={index}
                onClick={()=>handleItemClick(item)}
            >
                <p>{item.name}</p>
            </div>
            )
            }

        </div>
        }     
    </div>
  )
}

export default Dropdown