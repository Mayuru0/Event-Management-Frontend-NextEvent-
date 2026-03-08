import { apiSlice } from "../apiSlice";
import { PaymentType } from "@/type/PaymentType";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Verifies payment with Stripe & saves to DB — called on success page load
    verifyPayment: builder.mutation<PaymentType, string>({
      query: (sessionId) => ({
        url: `/ticket/verify-payment/${sessionId}`,
        method: "POST",
      }),
      transformResponse: (response: { success: boolean; data: PaymentType }) => response.data,
      invalidatesTags: ["Event"],
    }),

    getPaymentBySessionId: builder.query<PaymentType, string>({
      query: (sessionId) => `/payment/session/${sessionId}`,
      transformResponse: (response: { success: boolean; data: PaymentType }) => response.data,
    }),

    getPaymentsByUserId: builder.query<PaymentType[], string>({
      query: (userId) => `/payment/user/${userId}`,
      transformResponse: (response: { success: boolean; data: PaymentType[] }) => response.data,
    }),
  }),
});

export const {
  useVerifyPaymentMutation,
  useGetPaymentBySessionIdQuery,
  useGetPaymentsByUserIdQuery,
} = paymentApiSlice;
