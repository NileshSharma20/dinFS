import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import templateService from './templateService'

const initialState = {
    formResponseData: {
        customer_name:"",
        pricePerUnit:"",
        pricePerUnitOE:"",
        excDeliveryCharge:"",
        unit:"",
        product:'',
    },
    responseTemplate:[{}],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  }


// Form Response Submit
export const formResponseSubmit = createAsyncThunk(
    'formSubmit',
    async(formResponse, thunkAPI) =>{
        try {
            return await templateService.formSubmit(formResponse)
        } catch (error) {
            const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message) 
        }
    }
) 

export const templateSlice = createSlice({
    name: 'template',
    initialState,
    reducers: {
      resetTemplate: (state) => initialState
    },
    extraReducers: (builder) => {
      builder
      //form response submit
        .addCase(formResponseSubmit.pending, (state) => {
          state.isLoading = true
        })
        .addCase(formResponseSubmit.fulfilled, (state, action) => {
          state.isLoading = false
          state.isSuccess = true
          state.formResponseData = action.payload
        })
        .addCase(formResponseSubmit.rejected, (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
          state.formResponseSubmit = null
        })
    },
})

export const { resetTemplate } = templateSlice.actions
export default templateSlice.reducer