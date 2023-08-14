import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import "./Navbar.css"
import { logOutUser } from '../../features/auth/authSlice';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {token} = useSelector((state)=>state.auth) 

  const handleClick=()=>{
    navigate("/")
  }

  const handleLogout=()=>{
    dispatch(logOutUser())
    navigate("/")
  }

  return (
    <div className='navbar-container'> 
        <h1 onClick={()=>handleClick()}>Din</h1>
        {token && <div className='logout-btn' onClick={()=>handleLogout()}> Logout</div>}
    </div>
  )
}

export default Navbar