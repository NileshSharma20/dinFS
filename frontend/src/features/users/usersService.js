import axios from 'axios'

const users_URI = '/api/users/'

const getAllUsers = async(token)=>{
  const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(users_URI, config)

  // console.log(`usersRes: ${JSON.stringify(response,null,4)}`)

  return response.data
}

const usersService = {
    getAllUsers,
  }
  
  export default usersService