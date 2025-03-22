import { apiSlice } from "./apiSlice";
import { AUTH_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
      // onQueryStarted: (_, { queryFulFilled }) => handleResponse(), 
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
      }),
    })
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation
} = userApiSlice