import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import "./Navbar.css"
import { logOutUser } from '../../features/auth/authSlice';
import useDate from '../../hooks/useDate';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {token} = useSelector((state)=>state.auth)
  const {date, month, year, hour, minute} = useDate()

  const handleClick=()=>{
    navigate("/")
  }

  const handleLogout=()=>{
    dispatch(logOutUser())
    navigate("/login")
  }

  return (
    <div className='navbar-container' style={token?{}:{justifyContent:`center`}}> 
        {token && <h3>{`${date}/${month}/${year} ${hour}:${minute}`}</h3>}
        <h1 onClick={()=>handleClick()}>Din</h1>
        {token && <div className='logout-btn' onClick={()=>handleLogout()}> Logout</div>}
    </div>
  )
}

export default Navbar