import { useState } from 'react'
import { useDispatch } from "react-redux"
import "./Form.css"
import {resetAuth, setUserCredentials} from "../../features/auth/authSlice"

function LoginForm() {
    const dispatch = useDispatch(); 

    const [formData, setFormData] = useState({
        username:'',
        password:'',
    })

    const {username, password } = formData

    /////////////////////////////////////////////////
    //////// Functions /////////////////////////////
    ////////////////////////////////////////////////

    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    const onSubmit = (e) =>{
        e.preventDefault()

        if(username===null || password===null){
            console.log(`Please fill all fields`)
        }else{
            dispatch(resetAuth())
            const userData = {
                username,
                password
            }
            dispatch(setUserCredentials(userData))
            console.log(JSON.stringify(userData,null,4))
        }
    }

  return (
    <>
    <div className='form-container'>
        <form onSubmit={onSubmit}>
            <div className="form-grid">
                
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" 
                        className='form-control'
                        name= 'username'
                        id='username'
                        value = {username}
                        placeholder="Username"
                        autoComplete='off'
                        onChange={onChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" 
                        className='form-control'
                        name= 'password'
                        id='password'
                        value = {password}
                        placeholder="Password"
                        autoComplete='off'
                        onChange={onChange} />
                </div>

            </div>

            <div className="form-group">
                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </div>
        </form>
    </div>
    </>
  )
}

export default LoginForm