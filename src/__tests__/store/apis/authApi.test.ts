import { createAuthApiStoreSetup } from "../../../__testUtils__/storesSetups";

import { useLoginMutation } from "../../../store/apis/authApi";
import { setupServer } from 'msw/node'

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
import { waitFor } from "@testing-library/react";

import { authApiHandlers } from "../../../__testUtils__/handlers";

const server = setupServer(...authApiHandlers)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe("Login User", () => {
  const tokenBody: TokensState = {
    access:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InVzZXIiLCJwZXJtaXNzaW9ucyI6WyJ2aWV3X2NvbnRlbnQiXSwiaXNTdGFmZiI6ZmFsc2V9.obYAd0EK9QcZLdX3cDRNSRf2bvo7sw_O0J3qsiJ1w_A",
    refresh: "refresh",
  };

  const failedBody: TokensState = {
    access: null,
    refresh: null,
  };

  it("runs the userLoginMutation successfully", async () => {
    const initialAuthState: AuthState = {
      tokens: { access: null, refresh: null },
      userInfo: null,
    };

    const expectedAuthState: AuthState = {
      tokens: { access: tokenBody.access, refresh: tokenBody.refresh },
      userInfo: {
        id: "1",
        username: "user",
        permissions: ["view_content"],
        isStaff: false,
      },
    };

    const { result, store } = createAuthApiStoreSetup(useLoginMutation);

    const [triggerLogin] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const userArgs: LoginCredentials = {
      username: "success",
      password: "password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(initialAuthState);

    act(() => {
      triggerLogin(userArgs);
    });

    expect(result.current[1]).toMatchObject(pendingMutation("login", userArgs));
    debugger;
    await waitFor(() => expect(result.current[1].isSuccess).toBe(true));

    expect(result.current[1]).toMatchObject(
      fulfilledMutation("login", userArgs, tokenBody)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(expectedAuthState);
  });

  it("fails on login", async () => {
    const initialUserInfoState: AuthState = {
      tokens: { access: null, refresh: null },
      userInfo: null,
    };

    const { result, store } = createAuthApiStoreSetup(useLoginMutation);

    const [triggerLogin] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const userArgs: LoginCredentials = {
      username: "failure",
      password: "password",
    };

    const userInfoState = store.getState().auth;
    expect(userInfoState).toEqual(initialUserInfoState);

    act(() => {
      triggerLogin(userArgs);
    });

    expect(result.current[1]).toMatchObject({
      status: "pending",
      endpointName: "login",
      isLoading: true,
      isSuccess: false,
      isError: false,
      originalArgs: userArgs,
    });

    await waitFor(() => expect(result.current[1].status).toBe("rejected"));

    expect(result.current[1]).toMatchObject({
      status: "rejected",
      endpointName: "login",
      isLoading: false,
      isSuccess: false,
      isError: true,
      originalArgs: userArgs,
      error: {
        status: 400,
        data: failedBody,
      },
    });

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(initialUserInfoState);
  });
});
