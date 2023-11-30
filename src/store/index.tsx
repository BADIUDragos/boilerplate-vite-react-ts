import { configureStore, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { rootReducer, RootState } from './combinedReducer';
import { authApi, useLogoutMutation, useValidateQuery, useLoginMutation } from './apis/authApi';

import { useUserInfo, useTokens } from './hooks/authSliceHooks'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export type { RootState }

export { useLoginMutation, useValidateQuery, useLogoutMutation };

export { useUserInfo, useTokens }
export default store;
