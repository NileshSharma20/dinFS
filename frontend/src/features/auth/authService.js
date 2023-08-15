import axios from 'axios'

const auth_URI = '/api/auth/'

// Polling Function to check for Validity of Access Token
const healthCheck = async(token)=> {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
      }
    const response = await axios.get(auth_URI, config)
    // console.log(`healthService:${JSON.stringify(response,null,4)}`)
    return response.data
}

// Set User Credentials from Access Token
const setUserCredentials = async (userData) => {
    const response = await axios.post(auth_URI, userData)
    if(response.data){
        sessionStorage.setItem('token', JSON.stringify(response.data))
    }
    return response.data
}

// Refresh Token
const refreshToken= async ()=>{
    const response = await axios.get(auth_URI+"refresh")
    return response
}

// Logout User
const logoutUser = () => {
    sessionStorage.removeItem('token')
}

const authService = {
    healthCheck,
    setUserCredentials,
    refreshToken,
    logoutUser,
  }
  
  export default authService