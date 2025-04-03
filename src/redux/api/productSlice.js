import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products:[],
}

const productSlice = createSlice({
  name:"product",
  initialState,
  reducers: {
    setProducts:(state, action) => {
      state.products = action.payload
    },
    deleteProduct:(state, action) => {
      state.products = state.products.filter(pro => pro.id !== action.payload);
    }
  },
});

export const { setProducts, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
