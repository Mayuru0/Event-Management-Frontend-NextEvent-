import { apiSlice } from "../apiSlice"
import type { User, LoginCredentials } from "@/type/user"

interface LoginResponse {
  success: boolean
  message?: string
  user: User
  token: string
  refreshToken: string
}

interface UpdateUserResponse {
  success: boolean
  message: string
  data: User & { token: string }
}

interface RefreshTokenResponse {
  success: boolean
  token: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // registration requires a multipart form (including an uploaded profile picture),
    // so we accept a FormData object here instead of a plain JSON credential type.
    register: builder.mutation<{ user: User; token: string }, FormData>({
      query: (formData) => ({
        url: "/user/register",
        method: "POST",
        // FormData automatically sets the correct multipart headers.
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

    updateUser: builder.mutation<UpdateUserResponse, { UserId: string; formData: FormData }>({
      query: ({ UserId, formData }) => ({
        url: `/user/update/${UserId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, { refreshToken: string }>({
      query: (body) => ({
        url: "/user/refresh",
        method: "POST",
        body,
      }),
    }),

    logoutUser: builder.mutation<{ success: boolean; message: string }, { refreshToken: string }>({
      query: (body) => ({
        url: "/user/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useUpdateUserMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
} = authApiSlice
