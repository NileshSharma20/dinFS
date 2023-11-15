import React, { useState } from 'react'
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
            itemCode: prod.itemCode
        }

        passItemCode(data)
        setSelectedItem(prod.productName)
        setIsActive(!isActive)
    }

  return (
    <div className="drop-down-container">
        <div className="drop-down-item selected-drop-down" onClick={()=>handleClick()}>
            <p>{selectedItem===""?`Select a Cateogry`:selectedItem}</p>
        </div>     

        {isActive && 
        <div className="drop-down-list-container">
            {dataList?.map((item,index)=>
            <div className="drop-down-item" key={index}
                onClick={()=>handleItemClick(item)}
            >
                <p>{item.productName}</p>
            </div>
            )
            }

        </div>
        }     
    </div>
  )
}

export default Dropdown