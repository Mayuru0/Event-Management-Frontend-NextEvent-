import { apiSlice } from "../apiSlice"

export interface Review {
  _id: string
  userId: string
  name: string
  profilePic: string | null
  role: "customer" | "organizer" | "admin"
  stars: number
  comment: string
  timestamp: string
}

interface ReviewsResponse {
  success: boolean
  data: Review[]
}

interface CreateReviewResponse {
  success: boolean
  message: string
  data: Review
}

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], void>({
      query: () => "/review/get",
      transformResponse: (res: ReviewsResponse) => res.data,
      providesTags: ["Review"],
    }),

    createReview: builder.mutation<CreateReviewResponse, { stars: number; comment: string }>({
      query: (body) => ({
        url: "/review/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Review"],
    }),

    deleteReview: builder.mutation<{ success: boolean; message: string }, string>({
      query: (reviewId) => ({
        url: `/review/delete/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
})

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewApiSlice
