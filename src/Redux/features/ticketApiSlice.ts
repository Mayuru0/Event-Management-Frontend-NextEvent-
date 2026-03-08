import { apiSlice } from "../apiSlice";
import { TicketType, OrganizerStats, CheckoutSessionRequest } from "../../type/TicketType";

export const ticketApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<TicketType[], void>({
      query: () => "/ticket/get",
      providesTags: ["Ticket"],
    }),

    createTicket: builder.mutation<{ success: boolean; data: TicketType }, Partial<TicketType>>({
      query: (ticket) => ({
        url: "/ticket/add",
        method: "POST",
        body: ticket,
      }),
      invalidatesTags: ["Ticket"],
    }),

    getTicketsUserId: builder.query<TicketType[], string>({
      query: (userId) => `/ticket/user/${userId}`,
      providesTags: ["Ticket"],
    }),

    getTicketsorganizerId: builder.query<TicketType[], string>({
      query: (organizerId) => `/ticket/customer/${organizerId}`,
      providesTags: ["Ticket"],
    }),

    getOrganizerStats: builder.query<{ success: boolean; data: OrganizerStats }, string>({
      query: (organizerId) => `/ticket/stats/${organizerId}`,
      providesTags: ["Ticket"],
    }),

    updateTicket: builder.mutation<TicketType, { ticketId: string; body: Partial<TicketType> }>({
      query: ({ ticketId, body }) => ({
        url: `/ticket/${ticketId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Ticket"],
    }),

    deleteTicket: builder.mutation<{ message: string }, string>({
      query: (ticketId) => ({
        url: `/ticket/delete/${ticketId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ticket"],
    }),

    createCheckoutSession: builder.mutation<{ url: string }, CheckoutSessionRequest>({
      query: (data) => ({
        url: "/ticket/create-checkout-session",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useGetTicketsUserIdQuery,
  useGetTicketsorganizerIdQuery,
  useGetOrganizerStatsQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useCreateCheckoutSessionMutation,
} = ticketApiSlice;
