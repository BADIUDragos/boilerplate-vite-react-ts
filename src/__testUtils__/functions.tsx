import { AppStore } from "../store";
import { Wrapper } from "./testStores";
import { PropsWithChildren } from "react";

export const getWrapper = (store: AppStore) => {
  return ({ children }: PropsWithChildren<{}>) => <Wrapper store={store}>{children}</Wrapper>;
};