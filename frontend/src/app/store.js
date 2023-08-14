import { configureStore } from '@reduxjs/toolkit';
import templateReducer from '../features/template/templateSlice'
import productReducer from "../features/products/productSlice"
import authReducer from "../features/auth/authSlice"
import usersReducer from "../features/users/usersSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    template: templateReducer,
    users: usersReducer,
  },
});
