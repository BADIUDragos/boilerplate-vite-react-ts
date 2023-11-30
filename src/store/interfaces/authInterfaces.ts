export interface AuthState {
  tokens: TokensState | null
  userInfo: UserInfoState | null;
}

export interface UserInfoState {
  id: string
  username: string
  permissions: string[]
  email: string
  isSuperuser: boolean
}

export interface TokensState {
  access: string
  refresh: string
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AccessToken {
  access: string
}

export interface RefreshToken {
  refresh: string
}
