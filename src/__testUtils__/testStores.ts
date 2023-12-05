import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import { baseApi } from "../store/apis/baseApi";
import { authApi } from "../store/apis/authApi"

export const authStoreWithPreloadedState = (preloadedState: any) => {
  const store = configureStore({
    reducer: combineReducers({
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    }),
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });

  return store
}
