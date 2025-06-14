import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/authSlice';
import profileReducer from './api/profileSlice';
import loadingReducer from './features/loadingSlice'
import errorReducer from './features/errorSlice'
import categoryReducer from './api/categorySlice'
import productReducer from './api/productSlice'
import cartReducer from './api/cartSlice'
import confirmModelReducer from './api/confirmModelSlice'
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    loading: loadingReducer,
    error: errorReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    confirmModel: confirmModelReducer,
  },

  devTools:true,
});

setupListeners(store.dispatch);
export default store;