import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from localStorage
// const user = JSON.parse(localStorage.getItem('user'))

//Access Token : {UserInfo: "username":username, "roles":[roles]}

const initialState = {
  // user: user ? user : null,
  token: null, //Access Token
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const setUserCredentials = createAsyncThunk(
  'setUserCredentials',
  async(userData, thunkAPI) =>{
      try {
          return await authService.setUserCredentials(userData)
      } catch (error) {
          const message = (error.response && error.response.data 
              && error.response.data.message) ||
              error.message || error.toString()
      return thunkAPI.rejectWithValue(message) 
      }
  }
)  

export const logOutUser = createAsyncThunk(
  'logOutUser',
  async(_, thunkAPI) =>{
      try {
          return await authService.logOutUser()
      } catch (error) {
        const message = (error.response && error.response.data
            && error.response.data.message || error.message || error.toString())
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
      // Set User Credentials from Verified Access Token
      .addCase(setUserCredentials.pending, (state) => {
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

      //Logout User
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.token = null
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
      })
  }
})

export const { resetAuth } = authSlice.actions
export default authSlice.reducer