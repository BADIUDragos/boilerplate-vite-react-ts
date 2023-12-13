import authReducer, { setCredentials, logOut, getUserInfoFromAccessToken, getTokensFromLocalStorage } from "../authSlice";
import {
  AuthState,
  TokensState,
  UserInfoState,
} from "../../interfaces/authInterfaces";
import { vi, describe, it, expect } from "vitest";
import {
  createTokensState,
  createUserInfoState,
  loggedOutState,
  tokenBody,
} from "./authSetups";

const filledInitialState: AuthState = {
  tokens: createTokensState(),
  userInfo: createUserInfoState(),
};

describe("getTokensFromLocalStorage function", () => {
  it("should return ToeknsState when tokens are in localStorage", () => {
    vi.spyOn(Storage.prototype, "setItem");
    const tokens = {"access": tokenBody.access, "refresh": tokenBody.refresh }
    const stringifiedTokens = JSON.stringify(tokens)

    localStorage.setItem("tokens", stringifiedTokens)
    
    expect(getTokensFromLocalStorage()).toStrictEqual(tokenBody)
    expect(localStorage.setItem).toHaveBeenCalledWith('tokens' , stringifiedTokens);

    localStorage.clear()
  })

  it("should return null when tokens are not in localStorage", () => {
    expect(getTokensFromLocalStorage()).toEqual(null)
  })
})

describe("getUserInfoFromAccessToken function", () => {
  it("should return UserInfoState when tokens are in localStorage", () => {
    vi.spyOn(Storage.prototype, "setItem");
    const tokens = {"access": tokenBody.access, "refresh": tokenBody.refresh }
    const stringifiedTokens = JSON.stringify(tokens)

    localStorage.setItem("tokens", stringifiedTokens)
    
    expect(getUserInfoFromAccessToken()).toStrictEqual(createUserInfoState())
    expect(localStorage.setItem).toHaveBeenCalledWith('tokens' , stringifiedTokens);

    localStorage.clear()
  })

  it("should return null when tokens are not in localStorage", () => {
    
    expect(getUserInfoFromAccessToken()).toEqual(null)

    localStorage.clear()
  })
})

describe("authSlice basic functionalities", () => {
  it("should handle setCredentials and setItem to localstorage", () => {
    vi.spyOn(Storage.prototype, "setItem");

    const tokens: TokensState = tokenBody;
    const userInfo: UserInfoState =
      filledInitialState.userInfo as UserInfoState;

    const action = setCredentials({ tokens });
    const newState = authReducer(loggedOutState, action);

    expect(newState.tokens).toEqual(tokens);
    expect(newState.userInfo).toEqual(userInfo);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "tokens",
      JSON.stringify({ access: tokens.access, refresh: tokens.refresh })
    );

    vi.restoreAllMocks();
  });

  it("should handle logOut and removeItem to localstorage", () => {
    vi.spyOn(Storage.prototype, "removeItem");

    const action = logOut();
    const newState = authReducer(filledInitialState, action);

    const expectedState: AuthState = loggedOutState;

    expect(newState).toEqual(expectedState);

    expect(localStorage.removeItem).toHaveBeenCalledWith("tokens");

    vi.restoreAllMocks();
  });
});
