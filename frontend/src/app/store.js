import { configureStore } from '@reduxjs/toolkit';
import templateReducer from '../features/template/templateSlice'
import productReducer from "../features/products/productSlice"

export const store = configureStore({
  reducer: {
    template: templateReducer,
    product: productReducer
  },
});
