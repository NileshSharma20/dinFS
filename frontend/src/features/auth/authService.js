import axios from 'axios'

// Local URI
const main_URI = process.env.REACT_APP_LOCAL_URI 
                  || `https://api.dinmotoindia.com/api/`

const auth_URI = main_URI+'auth/'

// Polling Function to check for Validity of Access Token
const healthCheck = async(token)=> {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
      }
    const response = await axios.get(auth_URI, config)
    return response.data
}

// Set User Credentials from Access Token
const setUserCredentials = async (userData) => {
    const response = await axios.post(auth_URI, userData)
    if(response.data){
        sessionStorage.setItem('token', JSON.stringify(response.data))
    }
    // console.log(`response:${JSON.stringify(response.data,null,4)}`)
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