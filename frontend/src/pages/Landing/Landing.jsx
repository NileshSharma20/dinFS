import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "./Landing.css"
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';

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
       {/* {token? */}
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