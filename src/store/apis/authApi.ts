import {
  RefreshToken,
  LoginCredentials,
  TokensState,
  AccessToken,
} from "../interfaces/authInterfaces";
import { logOut, setCredentials } from "../slices/authSlice";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokensState, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({tokens: data}));
        } catch (error: unknown) {
          console.log(error)
        }
      },
    }),
    validate: build.query<TokensState, AccessToken>({
      query: (accessToken) => ({
        url: "/auth/validate",
        method: "GET",
        body: accessToken,
      }),
    }),
    logout: build.mutation<null, RefreshToken>({
      query: (refresh) => ({
        url: "/auth/logout",
        method: "POST",
        body: refresh,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
        } catch (error) {
          console.log(error)
        }
      },
    }),
  }),
});

export const { useLoginMutation, useValidateQuery,  useLogoutMutation } = authApi;
export { authApi };
