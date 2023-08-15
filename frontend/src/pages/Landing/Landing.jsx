import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Landing.css"
import { useDispatch, useSelector } from 'react-redux';
import { healthCheck, refreshToken } from '../../features/auth/authSlice';

function Landing() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {token} = useSelector((state)=>state.auth)

    const pathList = [{
        pathname:"products",
        name:"Products"
    },{
        pathname:"indiamart-templates",
        name:"Templates"
    },{
        pathname:"user-management",
        name:"User Management"
    }]

    const handleNavigation=(pathname)=>{
        let path = "/"+pathname
        navigate(path)
    }
  return (
    <div>
       {token?
       <>
       {pathList.map((item,index)=>
        <div className="path-options" key={index} 
            onClick={()=>handleNavigation(item.pathname)}>
                {item.name}
        </div>
        )}
        <div className="path-options"
            onClick={()=>dispatch(refreshToken())}
        >
            refresh token
        </div>
        <div className="path-options"
            onClick={()=>dispatch(healthCheck())}
        >
            Health Check
        </div>
        </>
        :
        <div className="path-options"
            onClick={()=>navigate("/login")}
        >
            Login
        </div>
    }
    </div>
  )
}

export default Landing