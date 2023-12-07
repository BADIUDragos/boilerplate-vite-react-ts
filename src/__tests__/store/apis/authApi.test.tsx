import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import { getWrapper } from "../../../__testUtils__/functions";
import {
  authStoreWithPreloadedState,
  renderWithProviders,
} from "../../../__testUtils__/testStores";

import {
  useLoginMutation,
  useLogoutMutation,
} from "../../../store/apis/authApi";
import { setupServer } from "msw/node";

import {
  AuthState,
  LoginCredentials,
  TokensState,
} from "../../../store/interfaces/authInterfaces";
import {
  fulfilledMutation,
  pendingMutation,
  uninitializedMutation,
} from "../../../__testUtils__/mutationObjectStates";
import { act } from "react-dom/test-utils";
import { renderHook, waitFor } from "@testing-library/react";

import { authApiHandler } from "../../../__testUtils__/handlers";
import { createAuthState, createTokensState, createUserInfoState, loggedOutState } from "../../../__testUtils__/sliceTestSetups/auth";

const server = setupServer(...authApiHandler);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

export const tokenBody: TokensState = {
  access:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsidmlld19jb250ZW50Il0sImVtYWlsIjoidXNlckByb2xscy1yb3ljZS5jb20iLCJpc1N1cGVydXNlciI6ZmFsc2UsImlzU3RhZmYiOmZhbHNlfQ.w5IlmWh_ED29v5dKTyVxlsMTCl8r0DymmJsjUsYahx4",
  refresh: "mock_refresh_token",
};

describe("Login User", () => {
  it("runs the userLoginMutation successfully", async () => {
    const preloadedState: AuthState = {
      tokens: { access: "", refresh: "" },
      userInfo: null,
    };

    const expectedAuthState: AuthState = createAuthState({
      userInfo: createUserInfoState(),
      tokens: createTokensState({access: tokenBody.access, refresh: tokenBody.refresh})
    });

    const store = authStoreWithPreloadedState();
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLoginMutation(undefined), {
      wrapper,
    });

    const [login] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const userArgs: LoginCredentials = {
      username: "success",
      password: "password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(preloadedState);

    act(() => {
      login(userArgs);
    });

    expect(result.current[1]).toMatchObject(pendingMutation("login", userArgs));

    await waitFor(() => expect(result.current[1].isSuccess).toEqual(true));

    expect(result.current[1]).toMatchObject(
      fulfilledMutation("login", userArgs, tokenBody)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(expectedAuthState);
  });

  it("runs the userLogoutMutation successfully", async () => {

    const preloadedState = {
      auth: createAuthState({
        userInfo: createUserInfoState(),
        tokens: createTokensState({access: tokenBody.access, refresh: tokenBody.refresh})
    })};

    const expectedAuthState = {
      auth: loggedOutState,
    };

    const { store } = renderWithProviders(<></>, {
      preloadedState: preloadedState,
    });
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLogoutMutation(undefined), {
      wrapper,
    });

    const [logout] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const refreshArg = {
      refresh: preloadedState.auth.tokens?.refresh as string,
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(preloadedState.auth);

    act(() => {
      logout(refreshArg);
    });

    expect(result.current[1]).toMatchObject(
      pendingMutation("logout", refreshArg)
    );

    await waitFor(() => expect(result.current[1].isSuccess).toEqual(true));

    expect(result.current[1]).toMatchObject(
      fulfilledMutation("logout", refreshArg, null)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(expectedAuthState.auth);
  });
});
