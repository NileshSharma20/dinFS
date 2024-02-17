import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';

import "./Landing.css"

function Landing() {
    const navigate = useNavigate();
    const {token} = useSelector((state)=>state.auth)
    const {status} = useAuth()

    const pathList = [{
        pathname:"products",
        name:"Products",
        accessLevel:["Admin","Manager","Employee"]
    },{
        pathname:"indiamart-templates",
        name:"Templates",
        accessLevel:["Admin","Manager","Employee"]
    },{
        pathname:"user-management",
        name:"User Management",
        accessLevel:["Admin"]
    },{
        pathname:"demand-slip-generator",
        name:"Demand Slip Generator",
        accessLevel:["Admin","Manager","Employee"]
    },{
        pathname:"demand-slip-analytics",
        name:"Demand Slip Analytics",
        accessLevel:["Admin","Manager"]
    }]

    const handleNavigation=(pathname)=>{
        let path = "/"+pathname
        navigate(path)
    }

    useEffect(()=>{
        if(!token){
            navigate("/login")
        }
    },[])


  return (
    <div>
       <>
       {pathList.filter(path=> path.accessLevel.includes(status)).map((item,index)=>
        <div className="path-options" key={index} 
            onClick={()=>handleNavigation(item.pathname)}>
                {item.name}
        </div>
        )}
        </>
    </div>
  )
}

export default Landing