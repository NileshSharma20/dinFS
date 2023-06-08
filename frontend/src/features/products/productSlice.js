import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from './productService'

const initialState = {
    // productData: [{
    //     productType:"",
    //     productBrand:"",
    //     productName:"",
    //     price:"",
    //     unitInStock:"",
    // }],
    productData:[],
    brandsList:[{
        brandName:"PULSAR",
      },{
        brandName:"DISCOVER",
      },{
        brandName:"CT-100",
      },{
        brandName:"PLATINA",
      },{
        brandName:"PASSION",
      },{
        brandName:"HUNK",
      },{
        brandName:"X-PRO",
      },{
        brandName:"ACTIVA",
      },{
        brandName:"UNICORN",
      },{
        brandName:"DREAM YUGA",
      },{
        brandName:"FZ",
      },{
        brandName:"R15",
      },{
        brandName:"RTR",
      },{
        brandName:"VICTOR",
      },{
        brandName:"STR",
      },{
        brandName:"APACHE",
      },{
        brandName:"PHONIX",
      },{
        brandName:"WEGO",
      },{
        brandName:"GIXXER",
      },{
        brandName:"ACHIVER",
      },],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  }


// Form Response Submit
export const createProductDataJSON = createAsyncThunk(
    'createProductDataJSON',
    async(csvFileData, thunkAPI) =>{
        try {
            const brandsList = thunkAPI.getState().product.brandsList
            console.log(`brands:${JSON.stringify(brandsList,null,4)}`)
            return await productService.createProductDataJSON(csvFileData, brandsList)
        } catch (error) {
            const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message) 
        }
    }
) 

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
      resetProducts: (state) => initialState
    },
    extraReducers: (builder) => {
      builder
      //Convert Product CSV Data to JSON Data
        .addCase(createProductDataJSON.pending, (state) => {
          state.isLoading = true
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
    },
})

export const { resetProducts } = productSlice.actions
export default productSlice.reducer