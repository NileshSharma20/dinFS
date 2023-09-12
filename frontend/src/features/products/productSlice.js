import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from './productService'

// Get user from localStorage
// const productData = JSON.parse(localStorage.getItem('productData'))

const initialState = {
    productData: [],
    noMatch: false,
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
            // const brandsList = thunkAPI.getState().product.brandsList
            // console.log(`brands:${JSON.stringify(brandsList,null,4)}`)
            return await productService.createProductDataJSON(csvFileData)
        } catch (error) {
            const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message) 
        }
    }
) 

// Get Products
export const getProducts = createAsyncThunk(
  'prod/getProducts',
  async(itemData, thunkAPI)=>{
    try {
      return await productService.getProducts(itemData)
    } catch (error) {
      const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
      return thunkAPI.rejectWithValue(message) 
    }
  }
)

export const searchProducts = createAsyncThunk(
  'prod/searchProducts',
  async(searchKey, thunkAPI)=>{
    try {
      return await productService.searchProducts(searchKey)
    } catch (error) {
      const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
      return thunkAPI.rejectWithValue(message) 
    }
  }
)

export const searchSKUProducts = createAsyncThunk(
  'prod/searchSKUProducts',
  async(itemData, thunkAPI)=>{
    try {
      return await productService.searchSKUProducts(itemData)
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
      // Convert Product CSV Data to JSON Data //////
        .addCase(createProductDataJSON.pending, (state) => {
          state.isLoading = true
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

      // Get products /////////////////////////////
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true
        state.noMatch = false
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.productData = action.payload
        if(action.payload.length===0){
          state.noMatch = true
        }
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Search Products /////////////////////////////
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true
        state.noMatch = false
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.productData = action.payload
        if(action.payload.length===0){
          state.noMatch = true
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Search SKU Products /////////////////////////////
      .addCase(searchSKUProducts.pending, (state) => {
        state.isLoading = true
        state.noMatch = false
      })
      .addCase(searchSKUProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.productData = action.payload
        if(action.payload.length===0){
          state.noMatch = true
        }
      })
      .addCase(searchSKUProducts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
    },
})

export const { resetProducts } = productSlice.actions
export default productSlice.reducer