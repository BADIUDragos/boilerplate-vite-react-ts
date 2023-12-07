import { AnyAction, Store } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

export const getWrapper = (store: Store<any, AnyAction>): React.FC => {
  return ({ children }: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}