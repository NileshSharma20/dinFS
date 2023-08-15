import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import usersService from './usersService'
import { refreshToken } from '../auth/authSlice'

const initialState = {
    usersList: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  }

export const getAllUsers = createAsyncThunk(
    'users/getAllUsers',
    async(_, thunkAPI) =>{
        try {
          try {
            
            const token = thunkAPI.getState().auth.token
            return await usersService.getAllUsers(token) 

          } catch (err) {
            
            if(err.response.status === 403){
              await thunkAPI.dispatch(refreshToken())

              const token = thunkAPI.getState().auth.token
              return await usersService.getAllUsers(token) 
            }
          }
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) 
            || error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)  

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      resetUser: (state) => initialState
    },
    extraReducers: (builder) => {
      builder
      .addCase(getAllUsers.pending, (state) => {
        state.isError = false
        state.isSuccess = false
        state.isLoading = true
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.usersList = action.payload
        state.message = ""
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersList = []
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
    }
})

export const { resetUser } = usersSlice.actions
export default usersSlice.reducer