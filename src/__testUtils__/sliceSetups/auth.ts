import { AuthState, TokensState, UserInfoState } from "../../store/interfaces/authInterfaces";

export const loggedOutState = {
  tokens: null,
  userInfo: null,
};

export const tokenBody: TokensState = {
  access:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwicGVybWlzc2lvbnMiOlsidmlld19jb250ZW50Il0sImVtYWlsIjoidXNlckByb2xscy1yb3ljZS5jb20iLCJpc1N1cGVydXNlciI6ZmFsc2UsImlzU3RhZmYiOmZhbHNlfQ.w5IlmWh_ED29v5dKTyVxlsMTCl8r0DymmJsjUsYahx4",
  refresh: "mock_refresh_token",
};

export const createUserInfoState = (overrides: Partial<UserInfoState> = {}): UserInfoState => {
  const defaultUserInfo: UserInfoState = {
    id: 1,
    username: 'user',
    email: 'user@rolls-royce.com',
    permissions: ['view_content'],
    isSuperuser: false,
    isStaff: false,
  };
  
  return { ...defaultUserInfo, ...overrides };
};

export const createTokensState = (overrides: Partial<TokensState> = {}): TokensState => {
  const defaultTokens: TokensState = {
    access: 'mock_access_token',
    refresh: 'mock_refresh_token',
  };
  
  return { ...defaultTokens, ...overrides };
};

export const createAuthState = (overrides: Partial<AuthState> = {}): AuthState => {
  
  const completeTokensOverrides = overrides.tokens 
    ? createTokensState(overrides.tokens) 
    : {};

  const completeUserInfoOverrides = overrides.userInfo 
    ? createUserInfoState(overrides.userInfo) 
    : {};

  return {
    tokens: { ...createTokensState(), ...completeTokensOverrides },
    userInfo: { ...createUserInfoState(), ...completeUserInfoOverrides },
  };
};