import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from './productService'
import { refreshToken } from '../auth/authSlice'

// Get user from localStorage
// const productData = JSON.parse(localStorage.getItem('productData'))

const initialState = {
    prodCodeList:[{
      productName:"Air-Filter",
      itemCode:"ARF",
    },  
    {
      productName:"Ball-Racer",
      itemCode:"RSR",
    },
    {
      productName:"Bendex",
      itemCode:"BDX",
    },
    {
      productName:"Brake-Shoe",
      itemCode:"BSH",
    },
    {
      productName:"Disc-Pad",
      itemCode:"DPD",
    },
    {
      productName:"Foot-Rest",
      itemCode:"FTR",
    },
    {
      productName:"Main-Stand",
      itemCode:"MSN",
    },
    {
      productName:"Mobil-Filter",
      itemCode:"MOF",
    },
    {
      productName:"Shocker",
      itemCode:"SKR",
    },
    
    {
      productName:"Side-Stand",
      itemCode:"SSN",
    },
    {
      productName:"Accelerator-Cable",
      itemCode:"ACC",
    },
    {
      productName:"Clutch-Asssembly",
      itemCode:"CFA",
    },
    {
      productName:"CAM-SHAFT",
      itemCode:"CMA"
    },
    {
      productName:"CDI",
      itemCode:"CDI"
    },
    {
      productName:"Clutch-Cable",
      itemCode:"CCC"
    },
    {
      productName:"Mirror",
      itemCode:"RVM"
    },
    {
      productName:"Rocker",
      itemCode:"RKR"
    },
    {
      productName:"Self-Cut",
      itemCode:"SFR"
    },
    {
      productName:"Timing-Chain",
      itemCode:"TCH"
    },
    {
      productName:"Timing-Chain-Adjuster",
      itemCode:"TCT"
    },
    {
      productName:"Chain-Sprocket-Kit",
      itemCode:"SPK"
    },
    {
      productName:"Caliper",
      itemCode:"CLP"
    },
    {
      productName:"Carburetor",
      itemCode:"CRB"
    },
    ],
    productData: [],
    productSKUData:[],
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

// Search Products
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

// Search by SKU
export const searchSKUProducts = createAsyncThunk(
  'prod/searchSKUProducts',
  async(itemData, thunkAPI)=>{
    try {
      return await productService.searchSKUProducts(itemData,itemData.skuOnlyFlag)
    } catch (error) {
      const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
      return thunkAPI.rejectWithValue(message) 
    }
  }
)

// Search by SKU
export const searchSKUProductsOnly = createAsyncThunk(
  'prod/searchSKUProductsOnly',
  async(itemData, thunkAPI)=>{
    try {
      return await productService.searchSKUProducts(itemData,itemData.skuOnlyFlag)
    } catch (error) {
      const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
      return thunkAPI.rejectWithValue(message) 
    }
  }
)

// Update Product Data
export const updateProduct = createAsyncThunk(
  'prod/updateProduct',
  async(itemData, thunkAPI)=>{
    try { 
      try {
            
        const token = thunkAPI.getState().auth.token
        return await productService.updateProduct({itemData,token})

      } catch (err) {
        
        if(err.response.status === 403){
          await thunkAPI.dispatch(refreshToken())

          const token = thunkAPI.getState().auth.token
          return await productService.updateProduct({itemData,token}) 
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

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
      resetProducts: (state) => initialState,
      resetSearchProducts: (state)=>({...state,
        productSKUData:[],
        noMatch: false,
      })
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

      // Get products /////////////////////////////
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true
        state.productSKUData=[]
        state.message = ""
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
        state.productSKUData=[]
        state.message = ""
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
        state.productSKUData=[]
        state.message = ""
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

      // Search SKU Products SKU only /////////////////////////////
      .addCase(searchSKUProductsOnly.pending, (state) => {
        state.isLoading = true
        state.productSKUData=[]
        state.message = ""
        state.noMatch = false
      })
      .addCase(searchSKUProductsOnly.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.productSKUData = action.payload
        if(action.payload.length===0){
          state.noMatch = true
        }
      })
      .addCase(searchSKUProductsOnly.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      // Update Product Data /////////////////////////////
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true
        state.productSKUData=[]
        state.isError = false
        state.isSuccess = false
        state.noMatch = false
        state.message = ""
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
    },
})

export const { resetProducts,
               resetSearchProducts } = productSlice.actions
export default productSlice.reducer