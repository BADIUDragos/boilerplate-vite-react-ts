import authReducer, { setCredentials, logOut, getInitialAuthState } from "../authSlice";
import {
  AuthState,
  TokensState,
  UserInfoState,
} from "../../interfaces/authInterfaces";
import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  createTokensState,
  createUserInfoState,
  loggedOutState,
  otherTokenBody,
  tokenBody,
} from "./authSetups";

const filledInitialState: AuthState = {
  tokens: createTokensState(),
  userInfo: createUserInfoState(),
};

describe("getInitialAuthState function", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null for both tokens and userInfo when localStorage is empty', () => {
    const state = getInitialAuthState();
    expect(state.tokens).toBeNull();
    expect(state.userInfo).toBeNull();
  });

  it('parses valid tokens from localStorage and decodes userInfo', () => {

    localStorage.setItem('tokens', JSON.stringify(tokenBody));

    const state = getInitialAuthState();

    expect(state.tokens).toEqual(tokenBody);
    expect(state.userInfo).toEqual(createUserInfoState());
  });

  it('returns null for both tokens and userInfo when token decoding fails', () => {
    const badTokens = { access: 'invalidAccessToken', refresh: 'mockRefreshToken' };
    localStorage.setItem('tokens', JSON.stringify(badTokens));

    const state = getInitialAuthState();

    expect(state.tokens).toBeNull();
    expect(state.userInfo).toBeNull();
  });

  it('handles invalid JSON in localStorage', () => {
    localStorage.setItem('tokens', 'invalidJson');

    const state = getInitialAuthState();

    expect(state.tokens).toBeNull();
    expect(state.userInfo).toBeNull();
  });
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

  it("should overrite current credentials if setCredentials called again", () => {
    vi.spyOn(Storage.prototype, "setItem");

    const otherTokens: TokensState = otherTokenBody;

    const action = setCredentials({ tokens: otherTokens });
    const newState = authReducer(filledInitialState, action);

    expect(newState.tokens).toEqual(otherTokens);
    expect(newState.userInfo).toEqual(createUserInfoState({permissions: ["view_content", "delete_content"], username: "other_user", email: "other_user@rolls-royce.com"}));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "tokens",
      JSON.stringify({ access: otherTokens.access, refresh: otherTokens.refresh })
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
