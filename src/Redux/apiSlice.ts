import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store/store";
import { BASE_URL } from "../utils/apiConfig";
import { updateToken, logout } from "./features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL + "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Re-authentication wrapper: on 401, try to refresh the access token
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      // Attempt to get a new access token
      const refreshResult = await baseQuery(
        {
          url: "/user/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const newToken = (refreshResult.data as { token: string }).token;
        api.dispatch(updateToken(newToken));
        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — log the user out
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Event", "Ticket", "Contact", "Review"],
  endpoints: () => ({}),
});
