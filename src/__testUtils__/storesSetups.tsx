import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApi } from "../store/apis/authApi";
import { Store, AnyAction } from "redux";
import { Provider } from "react-redux";
import authReducer from "../store/slices/authSlice";

export const getWrapper = (store: Store<any, AnyAction>): React.FC => {
  return ({ children }: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

export const createAuthApiStoreSetup = () => {
  const store = configureStore({
    reducer: combineReducers({
      [authApi.reducerPath]: authApi.reducer,
      auth: authReducer,
    }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });

  return { store };
};


