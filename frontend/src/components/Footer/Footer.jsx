import React from 'react'
import "./Footer.css"
import useAuth from '../../hooks/useAuth'

function Footer() {
    const {status} = useAuth()
  return (
    <div className='footer-container'>
        {(status!=="" && status)?status:"Din 2023"}
    </div>
  )
}

export default Footer