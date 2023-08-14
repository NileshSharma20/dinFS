import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from sessionStorage
const token = JSON.parse(sessionStorage.getItem('token'))?.accessToken

//Access Token : {UserInfo: "username":username, "roles":[roles]}

const initialState = {
  token: token?token:null, //Access Token
  verified: false,
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
        // if(response.accessToken){
        //   dispatch(healthCheck())
        // }
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
      console.log(`aT:${accessToken}`)
      // const healthResponse = 
      return await authService.healthCheck(accessToken)
    } catch (error) {
        const message = (error.response && error.response.data 
          && error.response.data.message) 
          || error.message || error.toString()
        // if(error.status === 403){
          console.log(`Error:${JSON.stringify(error,null,4)}`)
          console.log(`Error Status:${JSON.stringify(error.message)}`)
        // }

        //   const refreshResult =  await authService.refreshToken()

        //   if(refreshResult?.data){
        //     await dispatch(setUserCredentials({...refreshResult.data}))
        //   } else {
        //     if(refreshResult?.error?.status===403){
        //       //Handle expired Login
        //       message = "Login has expired. Login again."
        //     }
        //   }
        // }
        return thunkAPI.rejectWithValue(message)
    }

  }
)

export const logOutUser = createAsyncThunk(
  'auth/logOutUser',
  async(_, thunkAPI) =>{
      try {
          return await authService.logoutUser()
      } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        // if(message===)
        return thunkAPI.rejectWithValue(message)
    }
  }
)  

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: (state) => initialState
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
        // state.token = action.payload
        console.log(`Success Paylod: ${JSON.stringify(action.payload,null,4)}`)
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      //Logout User
      .addCase(logOutUser.pending, (state) => {
        state.isError = false
        state.isLoading = false
        state.isSuccess = false
        })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.token = null
        state.message = ""
      })
  }
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer