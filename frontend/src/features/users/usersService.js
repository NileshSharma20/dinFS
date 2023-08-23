import axios from 'axios'

const users_URI = '/api/users/'

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
  // console.log(`service data: ${JSON.stringify(userInfo,null,4)}, ${token}`)
  const response = await axios.patch(users_URI, userInfo, config)

  return response.data
} 

const usersService = {
    getAllUsers,
    updateUser,
  }
  
export default usersService