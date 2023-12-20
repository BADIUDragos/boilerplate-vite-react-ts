import {
  PreloadedState,
} from "@reduxjs/toolkit";
import setupStore, { AppStore, RootState } from "../store";
import { RenderOptions, render } from "@testing-library/react";
import { Provider } from "react-redux";
import React, { PropsWithChildren } from "react";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
  route?: string
}

interface WrapperProps {
  store: AppStore;
}

export const Wrapper: React.FC<PropsWithChildren<WrapperProps>> = ({ children, store }) => (
  <Provider store={store}>{children}</Provider>
);

export const getWrapper = (store: AppStore) => {
  return ({ children }: PropsWithChildren<{}>) => <Wrapper store={store}>{children}</Wrapper>;
};

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {

  return {
    store,
    ...render(ui, { wrapper: getWrapper(store), ...renderOptions }),
  };
}
