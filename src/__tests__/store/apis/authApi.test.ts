import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import { getWrapper } from "../../../__testUtils__/functions";
import { authStoreWithPreloadedState } from "../../../__testUtils__/testStores"

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
import { renderHook, waitFor } from "@testing-library/react";

import { authApiHandler } from "../../../__testUtils__/handlers";

const server = setupServer(...authApiHandler);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Login User", () => {
  const tokenBody: TokensState = {
    access:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsidmlld19jb250ZW50Il0sImVtYWlsIjoidXNlckByb2xscy1yb3ljZS5jb20iLCJpc1N1cGVydXNlciI6ZmFsc2UsImlzU3RhZmYiOmZhbHNlfQ.KYuB30UYnXLXEpbMDRBjOYnPpbSjWabjAJtCNWt288A",
    refresh: "refresh",
  };

  it("runs the userLoginMutation successfully", async () => {
    const preloadedState: AuthState = {
        tokens: { access: "", refresh: "" },
        userInfo: null,
    };

    const expectedAuthState: AuthState = {
        tokens: { access: tokenBody.access, refresh: tokenBody.refresh },
        userInfo: {
          id: 1,
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ["view_content"],
          isSuperuser: false,
          isStaff: false,
        },
    };

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

  
});
