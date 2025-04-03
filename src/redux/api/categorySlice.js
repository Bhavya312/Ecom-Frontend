import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
      setCategories:(state, action) => {
        state.categories = action.payload;
      },
      deleteCategory: (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      },
    },
});

export const { setCategories, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;