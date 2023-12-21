import { describe, it, expect } from "vitest";

import { getWrapper } from "../../__testUtils__/functions";
import { useLoginMutation } from "../../store/apis/authApi";
import { act } from "react-dom/test-utils";
import { renderHook, waitFor } from "@testing-library/react";
import { AuthState, LoginCredentials } from "../../store/interfaces/authInterfaces";
import { createAuthState, createTokensState, createUserInfoState, tokenBody } from "../../store/slices/__tests__/authSetups";
import { failedMutation, pendingMutation, uninitializedMutation } from "../../store/apis/__tests__/mutationObjectStates";
import { initializeTestServer } from "../../__testUtils__/testServerSetup";
import { baseQueriesHandlers } from "./baseQueriesHandlers";
import setupStore from "../../store";

const exampleTokenError = {
  code: "token_not_valid",
  messages: [
    {
      token_type: "access",
    },
  ],
};

const server = initializeTestServer(baseQueriesHandlers)

describe("baseQueryWithReauth", () => {
  it("updates tokens on isInvalitTokenError", async () => {
    const initialAuthState: AuthState = createAuthState({
      userInfo: createUserInfoState(),
      tokens: createTokensState({access: tokenBody.access})
    });

    const store = setupStore({auth: initialAuthState});
    const wrapper = getWrapper(store);

    const { result } = renderHook(() => useLoginMutation(undefined), {
      wrapper,
    });
    
    const [login] = result.current;
    expect(result.current[1]).toMatchObject(uninitializedMutation);

    const userArgs: LoginCredentials = {
      username: "refreshing tokens",
      password: "password",
    };

    const authState = store.getState().auth;
    expect(authState).toEqual(initialAuthState);

    act(() => {
      login(userArgs);
    });

    expect(result.current[1]).toMatchObject(pendingMutation("login", userArgs));

    await waitFor(() => expect(result.current[1].isError).toEqual(true));

    expect(result.current[1]).toMatchObject(
      failedMutation("login", userArgs)
    );

    const newAuthState = store.getState().auth

    expect(authState.userInfo.permissions).not.toEqual(newAuthState.userInfo.permissions)

  });
});
