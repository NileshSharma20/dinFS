import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'
import { resetUser } from '../users/usersSlice'
import { resetProducts } from '../products/productSlice'

// Get user from sessionStorage
const token = JSON.parse(sessionStorage.getItem('token'))?.accessToken

// Access Token : {UserInfo: "username":username, "roles":[roles]}

const initialState = {
  token: token?token:null, // Access Token
  username:"",
  roles:[],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const healthCheck= createAsyncThunk(
  'auth/healthCheck',
  async(_,thunkAPI)=>{
    try {
        const accessToken = thunkAPI.getState().auth.token ? thunkAPI.getState().auth.token : null;
        return await authService.healthCheck(accessToken)
    } catch (error) {
      const message = (error.response && error.response.data 
        && error.response.data.message) 
        || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const setUserCredentials = createAsyncThunk(
  'auth/setUserCredentials',
  async(userData, thunkAPI) =>{
      try {
        const response = await authService.setUserCredentials(userData)
        return response
      } catch (error) {
          const message = (error.response && error.response.data 
            && error.response.data.message) 
            || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
      }
  }
)  

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async(_,thunkAPI)=>{
    try {
      const accessToken = thunkAPI.getState().auth.token
      const res = await authService.healthCheck(accessToken)

      console.log(`res status:${JSON.stringify(res)}`)
      
      return res
    } catch (error) {
      
      const errorStatus =  error.response.status
      
      if(errorStatus === 403){
        try {
          const refreshResult = await authService.refreshToken()
          // console.log(`refreshSuccess:${JSON.stringify(refreshResult.data,null,4)}`)
          return refreshResult?.data
        } catch (err) {
          const errStatus = err.response.status

          if(errStatus){
            const message = (err.response && err.response.data 
              && err.response.data.message) 
              || err.message || err.toString()

            await thunkAPI.dispatch(logOutUser())

            return thunkAPI.rejectWithValue(message)
          }
        }
      }

      console.log(`Error Status type: ${typeof errorStatus}`)
    }
  }
  )

export const logOutUser = createAsyncThunk(
  'auth/logOutUser',
  async(_, thunkAPI) =>{
      try {
          thunkAPI.dispatch(resetUser())
          thunkAPI.dispatch(resetProducts())
          return authService.logoutUser()
      } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
  }
)  

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Health Check
      .addCase(healthCheck.pending, (state) => {
        state.isError = false
        state.isSuccess = false
        state.isLoading = true
      })
      .addCase(healthCheck.fulfilled, (state, action) => {
        state.verified = action.payload.verified
        state.isLoading = false
      })
      .addCase(healthCheck.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Set User Credentials from Verified Access Token
      .addCase(setUserCredentials.pending, (state) => {
        state.isError = false
        state.isSuccess = false
        state.isLoading = true
      })
      .addCase(setUserCredentials.fulfilled, (state, action) => {
        state.token = action.payload.accessToken
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(setUserCredentials.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Refresh Access Token
      .addCase(refreshToken.pending, (state) => {
        state.isError = false
        state.isSuccess = false
        state.isLoading = true
        state.message = ""
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        if(action.payload.accessToken){
          state.token = action.payload.accessToken
          sessionStorage.setItem('token', JSON.stringify(action.payload))
        }
        // console.log(`Success Paylod: ${JSON.stringify(action.payload,null,4)}`)
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(refreshToken.rejected, (state, action) => {
        if(action.payload.accessToken){
          state.token=action.payload.accessToken
        }
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      //Logout User
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.isError = false
        state.isLoading = false
        state.isSuccess = false
        state.token = null
        state.message = ""
      })
  }
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer