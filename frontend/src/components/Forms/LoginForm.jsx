import { useState } from 'react'
import { useDispatch } from "react-redux"
import "./Form.css"
import {refreshToken, resetAuth, setUserCredentials} from "../../features/auth/authSlice"

function LoginForm() {
    const dispatch = useDispatch(); 

    const [formData, setFormData] = useState({
        username:'',
        password:'',
    })

    const [showPasswordFlag, setShowPasswordFlag] = useState(false)

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
            // dispatch(refreshToken(userData))
            dispatch(setUserCredentials(userData))
            // console.log(JSON.stringify(userData,null,4))
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
                    <input type={showPasswordFlag?`text`:`password`} 
                        className='form-control'
                        name= 'password'
                        id='password'
                        value = {password}
                        placeholder="Password"
                        autoComplete='off'
                        onChange={onChange} />
                </div>

                <div className="form-group">
                    <div className="submit-btn"
                        onClick={()=>setShowPasswordFlag(!showPasswordFlag)}
                    >
                        Show Password
                    </div>
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