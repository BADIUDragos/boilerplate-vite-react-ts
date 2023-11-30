import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApi } from "../store/apis/authApi";
import authReducer from "../store/slices/authSlice";
import { Store, AnyAction } from "redux";
import { Provider } from "react-redux";
import { renderHook } from "@testing-library/react";

function getWrapper(store: Store<any, AnyAction>): React.FC {
  return ({ children }: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

export const createAuthApiStoreSetup = ( mutation: any) => {
  const store = configureStore({
    reducer: combineReducers({
      [authApi.reducerPath]: authApi.reducer,
      auth: authReducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });

  const wrapper = getWrapper(store);

  const { result } = renderHook(() => mutation(undefined), {
    wrapper,
  });

  return { result, store }
}