import {
  PreloadedState,
} from "@reduxjs/toolkit";
import setupStore, { AppStore, RootState } from "../store";
import { RenderOptions, render } from "@testing-library/react";
import { Provider } from "react-redux";
import React, { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
  route?: string
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    route = '/somepage',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  window.history.pushState({}, "Initial Page", route);

  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
