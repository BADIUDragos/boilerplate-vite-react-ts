// import authReducer, {
//   setCredentials,
//   logOut,
// } from "../../../store/slices/authSlice";
// import {
//   AuthState,
//   TokensState,
//   UserInfoState,
// } from "../../../store/interfaces/authInterfaces";

// const emptyInitialState: AuthState = {
//   tokens: null,
//   userInfo: null,
// };

// const filledInitialState: AuthState = {
//   tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
//   userInfo: {
//     id: "1",
//     username: "user",
//     email: "user@rolls-royce.com",
//     permissions: ["view_content"],
//     isSuperuser: false,
//   },
// };

// // jest.mock('../../../functions/decoding', () => ({
// //   decodeTokenAndSetUserInfo: jest.fn().mockReturnValue({
// //     id: "1",
// //     username: "user",
// //     permissions: ["view_content"],
// //     isStaff: false,
// //   }),
// // }));

// // describe('authSlice initialState', () => {

// //   it('initializes correctly based on localStorage and decode function', () => {

// //     jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
// //       if (key === "accessToken") return "mock_access_token";
// //       return 'mock_refresh_token';
// //     });

// //     const initialState = authReducer(undefined, { type: '@@INIT' });

// //     expect(initialState.tokens).toEqual({
// //       access: "mock_access_token",
// //       refresh: "mock_refresh_token",
// //     });
// //     expect(initialState.userInfo).toEqual({
// //       id: "1",
// //       username: "user",
// //       permissions: ["view_content"],
// //       isStaff: false,
// //     });

// //     jest.restoreAllMocks();
// //   });
// // });

// describe("authSlice basic functionalities", () => {
//   it("should handle setCredentials and setItem to localstorage", () => {
//     jest.spyOn(Storage.prototype, "setItem");

//     const tokens: TokensState = filledInitialState.tokens as TokensState;
//     const userInfo: UserInfoState =
//       filledInitialState.userInfo as UserInfoState;

//     const action = setCredentials({ tokens, userInfo });
//     const newState = authReducer(emptyInitialState, action);

//     expect(newState.tokens).toEqual(tokens);
//     expect(newState.userInfo).toEqual(userInfo);

//     expect(localStorage.setItem).toHaveBeenCalledWith(
//       "accessToken",
//       tokens.access
//     );
//     expect(localStorage.setItem).toHaveBeenCalledWith(
//       "refreshToken",
//       tokens.refresh
//     );

//     jest.restoreAllMocks();
//   });

//   it("should handle logOut and removeItem to localstorage", () => {
//     jest.spyOn(Storage.prototype, "removeItem");

//     const action = logOut();
//     const newState = authReducer(filledInitialState, action);

//     const expectedState: AuthState = emptyInitialState;

//     expect(newState).toEqual(expectedState);

//     expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
//     expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");

//     jest.restoreAllMocks();
//   });
// });
