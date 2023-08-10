import axios from 'axios'

const auth_URI = '/api/auth/'

// Set User Credentials from Access Token
const setUserCredentials = async (userData) => {
    const response = await axios.post(auth_URI, userData)
    if(!response.data){
        console.log(`resData: ${JSON.stringify(response.data,null,4)}`)
    } else {
        console.log(`Empty Data: ${JSON.stringify(response,null,4)}`)
    }
    return response.data
}

const authService = {
    setUserCredentials,
  }
  
  export default authService