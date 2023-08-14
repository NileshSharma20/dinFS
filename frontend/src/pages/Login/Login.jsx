import { useEffect } from 'react'
import { useSelector } from "react-redux"
import LoginForm from '../../components/Forms/LoginForm'

import "./Login.css"
import Loader from '../../components/Loader/Loader'
import { useNavigate } from "react-router-dom"

function Login() {
  const navigate= useNavigate()
  const {isLoading,isSuccess, isError, message} =useSelector((state)=>state.auth)

  useEffect(()=>{
    if(isSuccess){
      navigate("/")
    }
  },[isLoading])

  return (
    <>
    {isLoading && <Loader />}
    <div>
        Login
        <LoginForm />
        {isError && <p>{message}</p>}
    </div>
    </>
  )
}

export default Login