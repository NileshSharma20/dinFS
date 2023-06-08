import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Navbar.css"

function Navbar() {
  const navigate = useNavigate();

  const handleClick=()=>{
    navigate("/")
  }
  return (
    <div className='navbar-container'> 
        <h1 onClick={()=>handleClick()}>Din</h1>
    </div>
  )
}

export default Navbar