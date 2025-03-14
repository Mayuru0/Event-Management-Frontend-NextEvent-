import { apiSlice } from "../apiSlice"
import type { User, LoginCredentials, RegisterCredentials } from "@/type/user"

interface LoginResponse {
  success: boolean
  data?: {
    user: User
    token: string
  }
  message?: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<{ user: User; token: string }, RegisterCredentials>({
      query: (formData) => ({
        url: "/user/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (formData) => ({
        url: "/user/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    updateUser: builder.mutation<User, { UserId: string; formData: FormData }>({
      query: ({ UserId, formData }) => ({ 
        url: `/user/update/${UserId}`,      
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation, useUpdateUserMutation } = authApiSlice
