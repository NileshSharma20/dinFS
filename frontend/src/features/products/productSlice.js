import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from './productService'
import { refreshToken } from '../auth/authSlice'

// Get user from localStorage
// const productData = JSON.parse(localStorage.getItem('productData'))
const prodCodeListUnsorted = [
  {
    productName:"Lock-Kit",
    itemCode:"LKT"
  },
  {
    productName:"Accelerator-Cable",
    itemCode:"ACC"
  },
  {
    productName:"Air-Filter",
    itemCode:"ARF"
  },
  {
    productName:"Ball-Racer",
    itemCode:"RSR"
  },
  {
    productName:"Bendex",
    itemCode:"BDX"
  },
  {
    productName:"Brake-Shoe",
    itemCode:"BSH"
  },
  {
    productName:"Clutch-Cable",
    itemCode:"CCC"
  },
  {
    productName:"Cdi",
    itemCode:"CDI"
  },
  {
    productName:"Clutch-Assembly",
    itemCode:"CFA"
  },
  {
    productName:"Cam-Shaft",
    itemCode:"CMA"
  },
  {
    productName:"Disc-Pad",
    itemCode:"DPD"
  },
  {
    productName:"Foot-Rest",
    itemCode:"FTR"
  },
  {
    productName:"Main-Stand",
    itemCode:"MSN"
  },
  {
    productName:"Mobil-Filter",
    itemCode:"MOF"
  },
  {
    productName:"Rocker",
    itemCode:"RKR"
  },
  {
    productName:"Mirror",
    itemCode:"RVM"
  },
  {
    productName:"Self-Cut",
    itemCode:"SFR"
  },
  {
    productName:"Shocker",
    itemCode:"SKR"
  },
  {
    productName:"Side-Stand",
    itemCode:"SSN"
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
  {
    productName:"Timing-Chain-Pad",
    itemCode:"TCP"
  },
  {
    productName:"Visor-Glass",
    itemCode:"VSG"
  },
  {
    productName:"Clutch-Plate",
    itemCode:"CFP"
  },
  {
    productName:"Meter-Cable",
    itemCode:"SMC"
  },
  {
    productName:"Right-Hand-Switch",
    itemCode:"RHS"
  },
  {
    productName:"Armature",
    itemCode:"ARM"
  },
  {
    productName:"Balancer",
    itemCode:"BLN"
  },
  {
    productName:"Belt",
    itemCode:"BLT"
  },
  {
    productName:"Cylinder-Kit",
    itemCode:"BPA"
  },
  {
    productName:"Brake-Lever",
    itemCode:"BLV"
  },
  {
    productName:"Brake-Pedal",
    itemCode:"BPL"
  },
  {
    productName:"Chain-Adjuster",
    itemCode:"CNA"
  },
  {
    productName:"Chassis",
    itemCode:"CHS"
  },
  {
    productName:"Clutch-Center",
    itemCode:"CCN"
  },
  {
    productName:"Clutch-Gasket-Packing",
    itemCode:"CGP"
  },
  {
    productName:"Clutch-Hub",
    itemCode:"CHB"
  },
  {
    productName:"Clutch-Lever",
    itemCode:"CLV"
  },
  {
    productName:"Clutch-Pulley",
    itemCode:"CPA"
  },
  {
    productName:"Clutch-Shoe",
    itemCode:"CWT"
  },
  {
    productName:"Clutch-Switch",
    itemCode:"CSW"
  },
  {
    productName:"Clutch-Yoke",
    itemCode:"CYK"
  },
  {
    productName:"Condensor",
    itemCode:"CON"
  },
  {
    productName:"Coupling-Hub",
    itemCode:"KPH"
  },
  {
    productName:"Crank-Assembly",
    itemCode:"CRA"
  },
  {
    productName:"Disc-Lever",
    itemCode:"DLV"
  },
  {
    productName:"Disc-Plate",
    itemCode:"DSP"
  },
  {
    productName:"Disc-Yoke",
    itemCode:"DYK"
  },
  {
    productName:"Drum-Rubber",
    itemCode:"DRB"
  },
  {
    productName:"Drum",
    itemCode:"DRM"
  },
  {
    productName:"Face-Drive",
    itemCode:"TGR"
  },
  {
    productName:"Flasher",
    itemCode:"FLS"
  },
  {
    productName:"Foot-Rest-Rod",
    itemCode:"RRD"
  },
  {
    productName:"Fork-Assembly",
    itemCode:"FAS"
  },
  {
    productName:"Fork-Barrel",
    itemCode:"FBL"
  },
  {
    productName:"Fork-Ball",
    itemCode:"BRL"
  },
  {
    productName:"Fork-Oil-Seal",
    itemCode:"FOS"
  },
  {
    productName:"Fork-Rod",
    itemCode:"FRD"
  },
  {
    productName:"Front-Stop-Switch",
    itemCode:"FSW"
  },
  {
    productName:"Fuel-Petrol-Tap",
    itemCode:"FPT"
  },
  {
    productName:"Fuel-Tank-Cap",
    itemCode:"FTC"
  },
  {
    productName:"Gear-Box-Sprocket",
    itemCode:"GBS"
  },
  {
    productName:"Gear-Lever",
    itemCode:"GLV"
  },
  {
    productName:"Gear-Pinion-Drive",
    itemCode:"GPD"
  },
  {
    productName:"Gear-Shaft",
    itemCode:"GSF"
  },
  {
    productName:"Grip",
    itemCode:"GRP"
  },
  {
    productName:"Half-Packing-Kit",
    itemCode:"HKT"
  },
  {
    productName:"Handle",
    itemCode:"HND"
  },
  {
    productName:"Head-Light-Assembly",
    itemCode:"HLA"
  },
  {
    productName:"Head-Oring",
    itemCode:"HDO"
  },
  {
    productName:"Ht-Coil",
    itemCode:"HTC"
  },
  {
    productName:"Kick-Pedal",
    itemCode:"KKR"
  },
  {
    productName:"Kick-Shaft",
    itemCode:"KSF"
  },
  {
    productName:"Lever-Set",
    itemCode:"LST"
  },
  {
    productName:"Magnet-Packing",
    itemCode:"MGP"
  },
  {
    productName:"Main-Stand-Pin",
    itemCode:"MSP"
  },
  {
    productName:"Master-Cylinder-Assembly",
    itemCode:"MCA"
  },
  {
    productName:"Meter-Assembly",
    itemCode:"SMA"
  },
  {
    productName:"Meter-Drive",
    itemCode:"SMD"
  },
  {
    productName:"Meter-Pinion",
    itemCode:"SMP"
  },
  {
    productName:"Meter-Sensor",
    itemCode:"SMS"
  },
  {
    productName:"Oil-Pump",
    itemCode:"OPM"
  },
  {
    productName:"One-Way",
    itemCode:"OWY"
  },
  {
    productName:"Packing-Kit",
    itemCode:"PKT"
  },
  {
    productName:"Pickup-Coil",
    itemCode:"PCL"
  },
  {
    productName:"Plug-Cap",
    itemCode:"PLC"
  },
  {
    productName:"Plug-Socket",
    itemCode:"PLS"
  },
  {
    productName:"Rear-Stop-Switch",
    itemCode:"RSW"
  },
  {
    productName:"Rim",
    itemCode:"RIM"
  },
  {
    productName:"Roller-Kit",
    itemCode:"RLR"
  },
  {
    productName:"Self-Start-Motor",
    itemCode:"SSM"
  },
  {
    productName:"Suspension",
    itemCode:"SAS"
  },
  {
    productName:"Tail-Light-Assembly",
    itemCode:"TLA"
  },
  {
    productName:"Tee",
    itemCode:"TEE"
  },
  {
    productName:"Timing-Chain-Kit",
    itemCode:"TKT"
  },
  {
    productName:"Valve-Oil-Seal",
    itemCode:"VOS"
  },
  {
    productName:"Valve",
    itemCode:"VLV"
  },
  {
    productName:"Variator",
    itemCode:"VRT"
  },
      
]
const initialState = {
    prodCodeList: prodCodeListUnsorted.sort((a,b)=>
      a.productName.localeCompare(b.productName)
    ),
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