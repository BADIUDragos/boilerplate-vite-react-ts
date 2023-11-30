import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, TokensState } from "../interfaces/authInterfaces";
import { decodeToken } from "../../functions/decoding";

const tokensInitialState: TokensState = {
  access: localStorage.getItem("accessToken") || "",
  refresh: localStorage.getItem("refreshToken") || "",
}

const initialState: AuthState = {
  tokens: tokensInitialState || null,
  userInfo: tokensInitialState.access ? decodeToken(tokensInitialState.access) : null,
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
      state.userInfo = decodeToken(state.tokens.access)
      localStorage.setItem("accessToken", state.tokens.access);
      localStorage.setItem("refreshToken", state.tokens.refresh);
    },
    logOut(state) {
      state.tokens = null;
      state.userInfo = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
