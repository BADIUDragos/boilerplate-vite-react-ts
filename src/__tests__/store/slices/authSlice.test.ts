import authReducer, {
  setCredentials,
  logOut,
} from "../../../store/slices/authSlice";
import {
  AuthState,
  TokensState,
  UserInfoState,
} from "../../../store/interfaces/authInterfaces";
import { vi, describe, it, expect } from "vitest";
import { createTokensState, createUserInfoState, loggedOutState } from "../../../__testUtils__/sliceSetups/auth";
// import { decodeToken } from "../../../functions/decoding";
// import { createUserInfoState } from "../../../__testUtils__/sliceSetups/auth";

const filledInitialState: AuthState = {
  tokens: createTokensState(),
  userInfo: createUserInfoState(),
};

vi.mock("../../../functions/decoding", () => ({
  decodeToken: vi.fn().mockReturnValue({
    id: 1,
    username: 'user',
    email: 'user@rolls-royce.com',
    permissions: ['view_content'],
    isSuperuser: false,
    isStaff: false,
  }),
}));

// describe("authSlice initialState", () => {
//   it("initializes correctly based on localStorage and decode function", () => {
//     vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
//       if (key === "accessToken") return "mocked_access_token";
//       if (key === "refreshToken") return "mocked_refresh_token";
//       return null;
//     });

//     const userInfo = createUserInfoState()

//     vi.spyOn({ decodeToken }, "decodeToken").mockImplementation(() => (userInfo));

//     const initialState = authReducer(undefined, { type: "@@INIT" });

//     expect(initialState.tokens).toEqual({
//       access: "mocked_access_token",
//       refresh: "mocked_refresh_token",
//     });
//     expect(initialState.userInfo).toEqual(userInfo);

//     vi.restoreAllMocks();
//   });
// });

describe("authSlice basic functionalities", () => {
  it("should handle setCredentials and setItem to localstorage", () => {
    vi.spyOn(Storage.prototype, "setItem");

    const tokens: TokensState = filledInitialState.tokens as TokensState;
    const userInfo: UserInfoState =
      filledInitialState.userInfo as UserInfoState;

    const action = setCredentials({ tokens });
    const newState = authReducer(loggedOutState, action);

    expect(newState.tokens).toEqual(tokens);
    expect(newState.userInfo).toEqual(userInfo);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "objectToken",
      {'access': tokens.access, 'refresh': tokens.refresh}
    );

    vi.restoreAllMocks();
  });

  it("should handle logOut and removeItem to localstorage", () => {
    vi.spyOn(Storage.prototype, "removeItem");

    const action = logOut();
    const newState = authReducer(filledInitialState, action);

    const expectedState: AuthState = loggedOutState;

    expect(newState).toEqual(expectedState);

    expect(localStorage.removeItem).toHaveBeenCalledWith("objectToken");

    vi.restoreAllMocks();
  });
});
