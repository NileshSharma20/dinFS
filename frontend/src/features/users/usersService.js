import axios from 'axios'

const users_URI = 'https://api.dinmotoindia.com/api/users/'
// const users_URI = 'http://localhost:5000/api/users'

const getAllUsers = async(token)=>{
  const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(users_URI, config)

  return response.data
}

const updateUser = async({userInfo, token})=>{
  const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
  }
  
  const response = await axios.patch(users_URI, userInfo, config)

  return response.data
} 

const usersService = {
    getAllUsers,
    updateUser,
  }
  
export default usersService