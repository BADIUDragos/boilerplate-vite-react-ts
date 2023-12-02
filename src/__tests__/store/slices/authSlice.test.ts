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
// import { decodeToken } from "../../../functions/decoding";

const mock_access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsidmlld19jb250ZW50Il0sImVtYWlsIjoidXNlckByb2xscy1yb3ljZS5jb20iLCJpc1N1cGVydXNlciI6ZmFsc2UsImlzU3RhZmYiOmZhbHNlfQ.KYuB30UYnXLXEpbMDRBjOYnPpbSjWabjAJtCNWt288A";

const emptyInitialState: AuthState = {
  tokens: null,
  userInfo: null,
};

const filledInitialState: AuthState = {
  tokens: { access: mock_access_token, refresh: "mock_refresh_token" },
  userInfo: {
    id: 1,
    username: "user",
    email: "user@rolls-royce.com",
    permissions: ["view_content"],
    isSuperuser: false,
    isStaff: false,
  },
};

vi.mock("../../../functions/decoding", () => ({
  decodeToken: vi.fn().mockReturnValue({
    id: 1,
    username: "user",
    permissions: ["view_content"],
    email: "user@rolls-royce.com",
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

//     vi.spyOn({ decodeToken }, "decodeToken").mockImplementation(() => ({
//       id: 1,
//       username: "user",
//       permissions: ["view_content"],
//       email: "user@rolls-royce.com",
//       isSuperuser: false,
//       isStaff: false,
//     }));

//     const initialState = authReducer(undefined, { type: "@@INIT" });

//     expect(initialState.tokens).toEqual({
//       access: "mocked_access_token",
//       refresh: "mocked_refresh_token",
//     });
//     expect(initialState.userInfo).toEqual({
//       id: 1,
//       username: "user",
//       permissions: ["view_content"],
//       email: "user@rolls-royce.com",
//       isSuperuser: false,
//       isStaff: false,
//     });

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
    const newState = authReducer(emptyInitialState, action);

    expect(newState.tokens).toEqual(tokens);
    expect(newState.userInfo).toEqual(userInfo);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      tokens.access
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "refreshToken",
      tokens.refresh
    );

    vi.restoreAllMocks();
  });

  it("should handle logOut and removeItem to localstorage", () => {
    vi.spyOn(Storage.prototype, "removeItem");

    const action = logOut();
    const newState = authReducer(filledInitialState, action);

    const expectedState: AuthState = emptyInitialState;

    expect(newState).toEqual(expectedState);

    expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
    expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");

    vi.restoreAllMocks();
  });
});
