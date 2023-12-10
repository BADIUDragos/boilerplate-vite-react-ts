import { describe, it, expect } from "vitest";

import { getWrapper } from "../../../__testUtils__/functions";
import {
  authStoreWithPreloadedState,
} from "../../../__testUtils__/testStores";

import {
  useLoginMutation,
  useLogoutMutation,
} from "../../../store/apis/authApi";

import {
  AuthState,
  LoginCredentials,
} from "../../../store/interfaces/authInterfaces";
import {
  fulfilledMutation,
  pendingMutation,
  uninitializedMutation,
} from "../../../__testUtils__/mutationObjectStates";
import { act } from "react-dom/test-utils";
import { renderHook, waitFor } from "@testing-library/react";

import { authApiHandler } from "../../../__testUtils__/authApiHandlers";
import { createAuthState, createTokensState, createUserInfoState, loggedOutState, tokenBody } from "../../../__testUtils__/sliceSetups/auth";
import { initializeTestServer } from "../../../__testUtils__/testServerSetup";


initializeTestServer(authApiHandler);

describe("Login User", () => {
  it("runs the userLoginMutation successfully", async () => {
    const preloadedState: AuthState = {
      tokens: null,
      userInfo: null,
    };

    const expectedAuthState: AuthState = createAuthState({
      userInfo: createUserInfoState(),
      tokens: createTokensState({access: tokenBody.access})
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
        tokens: createTokensState({access: tokenBody.access})
    })};

    const expectedAuthState = {
      auth: loggedOutState,
    };

    const store = authStoreWithPreloadedState(preloadedState);
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
