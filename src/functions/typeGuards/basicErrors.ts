import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === 'object' && error != null && 'data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data
}


