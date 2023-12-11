type TokenError = {
  code: string;
  messages: { token_type: string }[];
};

export const isTokenError = (error: unknown): error is TokenError => {
  const TokenError = error as TokenError;
  if (TokenError.code && TokenError.messages && Array.isArray(TokenError.messages)) {
    return true
  }
  return false
}

const isAccessTokenInvalidError = (error: unknown): boolean => {
  if (isTokenError(error)) {

    return (
      error.code === "token_not_valid" &&
      error.messages.some((msg) => msg.token_type === "access")
    );
  }
  return false
};

export default isAccessTokenInvalidError;
