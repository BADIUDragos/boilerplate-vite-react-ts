import { AuthState, TokensState, UserInfoState } from "../../store/interfaces/authInterfaces";

export const loggedOutState = {
  tokens: null,
  userInfo: null,
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