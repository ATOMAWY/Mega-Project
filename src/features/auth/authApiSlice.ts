import { apiSlice } from "../../app/api/apiSlice";

export interface RegisterDto {
  fullName: string;
  email: string;
  age: number;
  address: string;
  password: string;
  confirmPassword: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/api/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    register: builder.mutation({
      query: (userData: RegisterDto) => ({
        url: "/api/auth/register",
        method: "POST",
        body: { ...userData },
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
