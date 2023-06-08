import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Landing.css"

function Landing() {
    const navigate = useNavigate();

    const pathList = [{
        pathname:"products",
        name:"Products"
    },{
        pathname:"indiamart-templates",
        name:"Templates"
    }]

    const handleNavigation=(pathname)=>{
        let path = "/"+pathname
        navigate(path)
    }
  return (
    <div>
       {pathList.map((item,index)=>
        <div className="path-options" key={index} 
            onClick={()=>handleNavigation(item.pathname)}>
                {item.name}
        </div>
        )}
    </div>
  )
}

export default Landing