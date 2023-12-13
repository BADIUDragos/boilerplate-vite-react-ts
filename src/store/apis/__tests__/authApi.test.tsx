import { describe, it, expect } from "vitest";

import { getWrapper } from "../../../__testUtils__/functions";
import {
  authStoreWithPreloadedState,
} from "../../../__testUtils__/testStores";

import {
  useLoginMutation,
  useLogoutMutation,
} from "../authApi";

import {
  AuthState,
  LoginCredentials,
} from "../../interfaces/authInterfaces";
import {
  failedMutation,
  fulfilledMutation,
  pendingMutation,
  uninitializedMutation,
} from "../../../__testUtils__/mutationObjectStates";
import { act } from "react-dom/test-utils";
import { renderHook, waitFor } from "@testing-library/react";

import { authApiHandler, failedLogOutHandler, failedLoginHandler } from "../../../__testUtils__/mswHandlers/auth/authApiHandlers";
import { createAuthState, createTokensState, createUserInfoState, loggedOutState, tokenBody } from "../../../__testUtils__/sliceSetups/auth";
import { initializeTestServer } from "../../../__testUtils__/testServerSetup";


const server = initializeTestServer(authApiHandler);

describe("Login User", () => {
  it("runs the userLoginMutation successfully", async () => {

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
    expect(authState).toEqual(loggedOutState);

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

  it("fails to login", async () => {

    server.use(failedLoginHandler)

    const store = authStoreWithPreloadedState();
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLoginMutation(undefined), {
      wrapper,
    });

    const [login] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const userArgs: LoginCredentials = {
      username: "failure",
      password: "bad password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(loggedOutState);

    act(() => {
      login(userArgs);
    });

    expect(result.current[1]).toMatchObject(pendingMutation("login", userArgs));

    await waitFor(() => expect(result.current[1].isError).toEqual(true));

    expect(result.current[1]).toMatchObject(
      failedMutation("login", userArgs)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(loggedOutState);
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

  it("fails userLogoutMutation but still logs out of front end", async () => {

    server.use(failedLogOutHandler)

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

    await waitFor(() => expect(result.current[1].isError).toEqual(true));

    expect(result.current[1]).toMatchObject(
      failedMutation("logout", refreshArg)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(expectedAuthState.auth);
  });
});
