import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  TokensState,
  UserInfoState,
} from "../interfaces/authInterfaces";
import { decodeToken } from "../../functions/decodeToken";

export const getTokensFromLocalStorage = (): TokensState | null => {
  const tokens = localStorage.getItem("tokens");
  return tokens ? JSON.parse(tokens) : null;
};

export const getUserInfoFromAccessToken = (): UserInfoState | null => {
  const tokens = getTokensFromLocalStorage();
  if (tokens && tokens.access) return decodeToken(tokens.access);
  return null;
};

const initialState: AuthState = {
  tokens: getTokensFromLocalStorage(),
  userInfo: getUserInfoFromAccessToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        tokens: TokensState;
      }>
    ) {
      state.tokens = action.payload.tokens;
      state.userInfo = decodeToken(state.tokens.access);

      localStorage.setItem(
        "tokens",
        JSON.stringify({
          access: state.tokens.access,
          refresh: state.tokens.refresh,
        })
      );
    },
    logOut(state) {
      state.tokens = null;
      state.userInfo = null;
      localStorage.removeItem("tokens");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
export type AuthSlice = ReturnType<typeof authSlice.reducer>;
