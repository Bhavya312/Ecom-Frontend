import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {},
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
      updateCart:(state, action) => {
        state.cart = action.payload;
      },
      deleteCart:(state) => {
        state.cart = {};
      }
    },
});

export const { updateCart, deleteCart } = cartSlice.actions;
export default cartSlice.reducer;