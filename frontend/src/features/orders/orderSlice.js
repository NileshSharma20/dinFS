import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from './orderService'
import { refreshToken } from '../auth/authSlice'

const initialState = {
    orderData:[],
    isLoading:false,
    isError:false,
    isSuccess:false
}

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
      resetOrders: (state) => initialState
    },
    extraReducers: (builder) => {
      builder
      // Convert Product CSV Data to JSON Data //////
        .addCase(createProductDataJSON.pending, (state) => {
          state.isLoading = true
          state.productSKUData=[]
          state.noMatch = false
        })
        .addCase(createProductDataJSON.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.productData = action.payload
        })
        .addCase(createProductDataJSON.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })
    }
})

export const { resetOrders } = orderSlice.actions
export default orderSlice.reducer