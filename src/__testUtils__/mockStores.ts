import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";

export const authStoreWithPreloadedState = (preloadedState: any) => {
  const store = configureStore({
    reducer: combineReducers({
      auth: authReducer,
    }),
    preloadedState: preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(),
  });

  return store
}
