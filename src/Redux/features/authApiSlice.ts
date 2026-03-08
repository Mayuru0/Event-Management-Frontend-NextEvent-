import { apiSlice } from "../apiSlice"
import type { User, LoginCredentials, RegisterCredentials } from "@/type/user"

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
    register: builder.mutation<{ user: User; token: string }, Partial<RegisterCredentials>>({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        // send JSON; the server should expect an object, not a multipart form
        body,
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
