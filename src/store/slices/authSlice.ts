import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, TokensState } from "../interfaces/authInterfaces";
import { decodeToken } from "../../functions/decodeToken";

const getTokensFromLocalStorage = () => {
  const tokensObject = localStorage.getItem("objectToken");
  return tokensObject ? JSON.parse(tokensObject) : null;
};

const getUserInfoFromAccessToken = () => {
  const tokens = getTokensFromLocalStorage()
  if (tokens && tokens.access) return decodeToken(tokens.access)
  return null
}

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
      state.userInfo = decodeToken(state.tokens.access) 

      localStorage.setItem("objectToken", JSON.stringify({'access' : state.tokens.access, 'refresh' : state.tokens.refresh}));

    },
    logOut(state) {
      state.tokens = null;
      state.userInfo = null;
      localStorage.removeItem("objectToken");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
export type AuthSlice = ReturnType<typeof authSlice.reducer>;
