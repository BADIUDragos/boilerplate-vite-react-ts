import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

const isTokenInvalidError = (
  error: FetchBaseQueryError | SerializedError
): boolean => {
  return (
    'data' in error && error.data !== null &&
    typeof error.data === 'object' &&
    "detail" in error.data &&
    error?.data?.detail === "Given token not valid for any token type" &&
    "messages" in error.data &&
    Array.isArray(error.data.messages) &&
    error.data.messages.some((msg) => msg.token_type === "access")
  );
};

export default isTokenInvalidError;
