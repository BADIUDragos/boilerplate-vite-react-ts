import { PreloadedState, combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import { baseApi } from "../store/apis/baseApi";
import { authApi } from "../store/apis/authApi"
import { AppStore, RootState, setupStore } from "../store";
import { RenderOptions, render } from "@testing-library/react";
import { Provider } from "react-redux";
import React, { PropsWithChildren } from 'react'


interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export const authStoreWithPreloadedState = (preloadedState?: any) => {
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