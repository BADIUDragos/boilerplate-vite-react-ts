import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import { createAuthApiStoreSetup } from "../../../__testUtils__/storesSetups";

import { useLoginMutation } from "../../../store/apis/authApi";
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
import { waitFor } from "@testing-library/react";

import { authApiHandler } from "../../../__testUtils__/handlers";

const server = setupServer(...authApiHandler);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Login User", () => {
  const tokenBody: TokensState = {
    access:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InVzZXIiLCJwZXJtaXNzaW9ucyI6WyJ2aWV3X2NvbnRlbnQiXSwiaXNTdGFmZiI6ZmFsc2V9.obYAd0EK9QcZLdX3cDRNSRf2bvo7sw_O0J3qsiJ1w_A",
    refresh: "refresh",
  };

  it("runs the userLoginMutation successfully", async () => {
    const preloadedState = {
      auth: {
        tokens: { access: "", refresh: "" },
        userInfo: null,
      },
    };

    const expectedAuthState = {
      auth: {
        tokens: { access: tokenBody.access, refresh: tokenBody.refresh },
        userInfo: {
          id: "1",
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ["view_content"],
          isSuperuser: false,
        },
      },
    };

    const { result, store } = createAuthApiStoreSetup(
      useLoginMutation,
      preloadedState
    );

    const [triggerLogin] = result.current;

    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const userArgs: LoginCredentials = {
      username: "success",
      password: "password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(expectedAuthState.auth);

    act(() => {
      triggerLogin(userArgs);
    });

    expect(result.current[1]).toMatchObject(pendingMutation("login", userArgs));

    await waitFor(() => expect(result.current[1].isSuccess).toEqual(true));

    expect(result.current[1]).toMatchObject(
      fulfilledMutation("login", userArgs, tokenBody)
    );

    const newUserInfoState = store.getState().auth;
    expect(newUserInfoState).toEqual(expectedAuthState);
  });

  // it("fails on login", async () => {
  //   const initialUserInfoState: AuthState = {
  //     tokens: { access: "", refresh: "" },
  //     userInfo: null,
  //   };

  //   const { result, store } = createAuthApiStoreSetup(useLoginMutation);

  //   const [triggerLogin] = result.current;

  //   expect(result.current[1]).toMatchObject(uninitializedMutation);

  //   const userArgs: LoginCredentials = {
  //     username: "failure",
  //     password: "password",
  //   };

  //   const userInfoState = store.getState().auth;
  //   expect(userInfoState).toEqual(initialUserInfoState);

  //   act(() => {
  //     triggerLogin(userArgs);
  //   });

  //   expect(result.current[1]).toMatchObject({
  //     status: "pending",
  //     endpointName: "login",
  //     isLoading: true,
  //     isSuccess: false,
  //     isError: false,
  //     originalArgs: userArgs,
  //   });

  //   await waitFor(() => expect(result.current[1].status).toBe("rejected"));

  //   expect(result.current[1].error).toEqual(
  //     {
  //       error: "TypeError: fetch failed",
  //       status: "FETCH_ERROR",
  //     }
  //   );

  //   const newUserInfoState = store.getState().auth;
  //   expect(newUserInfoState).toEqual(initialUserInfoState);
  // });
});
