import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {},
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
      updateProfile:(state, action) => {
        state.profile = action.payload;
      },
      deleteProfile:(state) => {
        state.profile = {};
      }
    },
});

export const { updateProfile, deleteProfile } = profileSlice.actions;
export default profileSlice.reducer;