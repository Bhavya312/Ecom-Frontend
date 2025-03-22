import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/auth/authSlice';
import loadingReducer from './features/loadingSlice'
import errorReducer from './features/errorSlice'
import categoryReducer from './api/categorySlice'
import confirmModelReducer from './api/confirmModelSlice'
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    loading: loadingReducer,
    error: errorReducer,
    categories: categoryReducer,
    confirmModel: confirmModelReducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools:true,
});

setupListeners(store.dispatch);
export default store;