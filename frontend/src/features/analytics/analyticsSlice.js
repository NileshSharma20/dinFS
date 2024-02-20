import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import analyticsService from './analyticsService'
import { refreshToken } from '../auth/authSlice'

const initialState = {
    demandSlipData:[],
    
    isLoading:false,
    isError:false,
    isSuccess:false,
    message:""
}
export const getDemandslipAggregateData = createAsyncThunk(
    'orders/getDemandslipAggregateData',
    async(filterParams={}, thunkAPI)=>{
        try {
            try {
                const token = thunkAPI.getState().auth.token
                return await analyticsService.getDemandslipAggregateData(filterParams,token)
            } catch (err) {
                if(err.response.status === 403){
                    await thunkAPI.dispatch(refreshToken())
          
                    const token = thunkAPI.getState().auth.token
                    return await analyticsService.getDemandslipAggregateData(filterParams,token)
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

export const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
      resetAnalytics: (state) => initialState,
    //   resetAfterNewDemandSlip: (state)=>({...state,
    //     isError:false,
    //     isLoading:false,
    //     updatedDataFlag:false,
    //     isSuccess:false,
    //     message:""
    //   })
    },
    extraReducers: (builder) => {
      builder
      // Get Demand Slip Aggregated Data
      .addCase(getDemandslipAggregateData.pending, (state)=>{
        state.isLoading = true
        state.isSuccess = false
        state.isError = false
        // state.demandSlipData = []
      })
      .addCase(getDemandslipAggregateData.fulfilled, (state, action)=>{
        state.isLoading = false
        state.isSuccess = true
        state.demandSlipData = action.payload
      })
      .addCase(getDemandslipAggregateData.rejected, (state, action)=>{
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
    }
})

export const { resetAnalytics } = analyticsSlice.actions
export default analyticsSlice.reducer