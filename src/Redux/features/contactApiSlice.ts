import { apiSlice } from "../apiSlice"

export interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  subject: string
  reason: string
}

export interface ContactResponse {
  message: string
}

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<ContactResponse, ContactPayload>({
      query: (body) => ({
        url: "/contact/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),

    getContacts: builder.query<ContactPayload[], void>({
      query: () => "/contact/get",
      providesTags: ["Contact"],
    }),

    deleteContact: builder.mutation<{ message: string }, string>({
      query: (contactId) => ({
        url: `/contact/delete/${contactId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
})

export const {
  useCreateContactMutation,
  useGetContactsQuery,
  useDeleteContactMutation,
} = contactApiSlice
