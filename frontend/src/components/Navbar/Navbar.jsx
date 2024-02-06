import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { BiLogOut, BiMenu } from "react-icons/bi"
import { logOutUser } from '../../features/auth/authSlice';

import "./Navbar.css"
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {token} = useSelector((state)=>state.auth)

  // const {prodCodeList}=useSelector((state)=>state.product)

  // const [legendFlag, setLegendFlag] = useState(false)

  const handleClick=()=>{
    navigate("/")
  }

  const handleLogout=()=>{
    dispatch(logOutUser())
    navigate("/login")
  }

  // const handleMenu=()=>{
  //   setLegendFlag(!legendFlag)
  // }

  return (
    <div className='navbar-container' style={token?{}:{justifyContent:`center`}}> 
        {token && <div className='menu-btn'><BiMenu /></div>}
        <h1 onClick={()=>handleClick()}>Din</h1>
        {token && <div className='logout-btn' onClick={()=>handleLogout()}> <BiLogOut/></div>}
    </div>
  )
}

export default Navbar