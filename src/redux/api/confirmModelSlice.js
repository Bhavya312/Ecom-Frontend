import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  itemId: null,
  message: ""
}

const confirmModelSlice = createSlice({
  name:"confirmModel",
  initialState,
  reducers:{
    openModel:(state, action) => {
      state.isOpen = true;
      state.itemId = action.payload.id;
      state.message = action.payload.message || 'Are you sure you want to proceed?';
    },
    closeModel:(state) => {
      state.isOpen = false;
      state.itemId = null;
      state.message = "";
    }
  }
});

export const { openModel, closeModel } = confirmModelSlice.actions;
export default confirmModelSlice.reducer;