import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from './orderService'
import { refreshToken } from '../auth/authSlice'

const initialState = {
    orderData:[],
    pendingOrderList: [],
    partialOrderList: [],
    failedOrderList: [],
    fulfilledOrderList: [],
    newDemandSlip:{},
    updatedDataFlag:false,
    isLoading:false,
    isError:false,
    isSuccess:false,
    message:""
}

// Get All Demand Orders
export const getAllDemandSlips = createAsyncThunk(
  'orders/getAllDemandSlips',
  async(_, thunkAPI)=>{
    try {
      try {
            
        const token = thunkAPI.getState().auth.token
        return await orderService.getAllDemandSlips(token)

      } catch (err) {
        
        if(err.response.status === 403){
          await thunkAPI.dispatch(refreshToken())

          const token = thunkAPI.getState().auth.token
          return await orderService.getAllDemandSlips(token) 
        }
      }
    } catch (error) {
      const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get User and Date Filtered Demand Orders
export const getFilteredDemandSlips = createAsyncThunk(
  'orders/getFilteredDemandSlips',
  async(filterParams={}, thunkAPI)=>{
    try {
      try {
            
        const token = thunkAPI.getState().auth.token
        return await orderService.getFilteredDemandSlips(filterParams,token)

      } catch (err) {
        
        if(err.response.status === 403){
          await thunkAPI.dispatch(refreshToken())

          const token = thunkAPI.getState().auth.token
          return await orderService.getFilteredDemandSlips(filterParams,token) 
        }
      }
    } catch (error) {
      const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const generateDemandSlip = createAsyncThunk(
  'orders/generateDemandSlip',
  async(demandSlipData,thunkAPI)=>{
    try {
      try {
            
        const token = thunkAPI.getState().auth.token
        return await orderService.generateDemandSlip({demandSlipData,token})
        // await thunkAPI.dispatch(getFilteredDemandSlips()) 

      } catch (err) {
        
        if(err.response.status === 403){
          await thunkAPI.dispatch(refreshToken())

          const token = thunkAPI.getState().auth.token
          return await orderService.generateDemandSlip({demandSlipData,token})
          // await thunkAPI.dispatch(getFilteredDemandSlips()) 
        }
      }
    } catch (error) {
      const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const updateDemandSlip = createAsyncThunk(
  'orders/updateDemandSlip',
  async(updatedData,thunkAPI)=>{
    try {
      try {
            
        const token = thunkAPI.getState().auth.token
        return await orderService.updateDemandSlip({updatedData,token})
        // await thunkAPI.dispatch(getFilteredDemandSlips()) 

      } catch (err) {
        
        if(err.response.status === 403){
          await thunkAPI.dispatch(refreshToken())

          const token = thunkAPI.getState().auth.token
          return await orderService.updateDemandSlip({updatedData,token})
          // await thunkAPI.dispatch(getFilteredDemandSlips()) 
        }
      }
    } catch (error) {
      const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
      resetOrders: (state) => initialState,
      resetAfterNewDemandSlip: (state)=>({...state,
        isError:false,
        isLoading:false,
        updatedDataFlag:false,
        isSuccess:false,
        message:""
      })
    },
    extraReducers: (builder) => {
      builder
      // Get All Demand Slip Data //////
        .addCase(getAllDemandSlips.pending, (state) => {
          state.isLoading = true
          state.updatedDataFlag=false
          state.orderData=[]
          state.pendingOrderList=[]
          state.partialOrderList=[]
          state.failedOrderList=[]
          state.fulfilledOrderList=[]
        })
        .addCase(getAllDemandSlips.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.orderData = action.payload
          state.pendingOrderList = action.payload.filter((order)=>order.status==="pending")
          state.partialOrderList = action.payload.filter((order)=>order.status==="partial")
          state.failedOrderList = action.payload.filter((order)=>order.status==="failed")
          state.fulfilledOrderList = action.payload.filter((order)=>order.status==="fulfilled")
        
        })
        .addCase(getAllDemandSlips.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })
      
      // Get User and Date Filtered Demand Slip Data //////
        .addCase(getFilteredDemandSlips.pending, (state) => {
          state.isLoading = true
          state.updatedDataFlag=false
          state.orderData=[]
          state.pendingOrderList=[]
          state.partialOrderList=[]
          state.failedOrderList=[]
          state.fulfilledOrderList=[]
        })
        .addCase(getFilteredDemandSlips.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.orderData = action.payload
          state.pendingOrderList = action.payload.filter((order)=>order.status==="pending")
          state.partialOrderList = action.payload.filter((order)=>order.status==="partial")
          state.failedOrderList = action.payload.filter((order)=>order.status==="failed")
          state.fulfilledOrderList = action.payload.filter((order)=>order.status==="fulfilled")
        })
        .addCase(getFilteredDemandSlips.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })

      // Generate New Demand Slip //////
        .addCase(generateDemandSlip.pending, (state) => {
          state.isLoading = true
          state.updatedDataFlag=false
          state.isSuccess = false
          state.isError = false
          state.newDemandSlip = {}
          // state.orderData=[]
        })
        .addCase(generateDemandSlip.fulfilled, (state, action) => {
          state.isLoading = false
          state.isError = false
          state.isSuccess = true
          state.newDemandSlip = action.payload
          state.message = `New Demand Reciept ${action.payload.ticketNumber} created`
        })
        .addCase(generateDemandSlip.rejected, (state, action) => {
          state.isLoading = false
          state.isSuccess = false
          state.isError = true
          state.message = action.payload
        })

      // Update Demand Slip Data //////
        .addCase(updateDemandSlip.pending, (state) => {
          state.isLoading = true
          state.updatedDataFlag=false
        })
        .addCase(updateDemandSlip.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.updatedDataFlag=true
          state.message = action.payload
        })
        .addCase(updateDemandSlip.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        })
    }
})

export const { resetOrders,
              resetAfterNewDemandSlip } = orderSlice.actions
export default orderSlice.reducer