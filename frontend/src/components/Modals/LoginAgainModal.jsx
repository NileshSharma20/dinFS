import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Modal.css"

function LoginAgainModal() {
    const navigate = useNavigate()

  return (
    <>
    <div className="modal-backdrop"></div>
    <div className='modal-container'>
        <div className="form-container">
            <p>Login has Expired. Login again.</p>
            <br />

        <div className="control-box">
          <div className="control-section">
            
            <div className="control-btn"
            //   style={{backgroundColor:`var(--buttonGreen)`}}
            onClick={()=>navigate("/")}
            >
              Go to Login
            </div>
            </div>
        </div>
        </div>

    </div>
    </>
  )
}

export default LoginAgainModal