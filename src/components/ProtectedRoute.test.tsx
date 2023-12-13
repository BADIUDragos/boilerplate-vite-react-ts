import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import {
  AuthState
} from "../store/interfaces/authInterfaces";
import ProtectedRoute from "./ProtectedRoute";
import { renderWithProviders } from "../__testUtils__/testStores";

import "@testing-library/jest-dom/vitest";
import { createAuthState, createUserInfoState, loggedOutState } from "../__testUtils__/sliceSetups/auth";

describe("ProtectedRoute", () => {
  const setup = (
    authState: { auth: AuthState },
    requiredPermissions: string[] = [],
    requiredStaff: boolean = false,
    redirectUrl: string = "/login"
  ) => {
    renderWithProviders(
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                redirectUrl={redirectUrl}
                requiredPermissions={requiredPermissions}
                requiredStaff={requiredStaff}
              >
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>,
      { preloadedState: authState,
        route: '/protected' },
    );
  };

  it("renders children for authorized users", () => {
    const state = createAuthState();

    setup({ auth: state }, ["view_content"]);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("does not render children for unauthorized users", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ permissions: ["other_permissions"] }),
    });

    setup({ auth: state }, ["view_content"]);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and permissions required", () => {
    setup({ auth: loggedOutState }, ["view_content"]);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and requiredStaff", () => {
    setup({ auth: loggedOutState }, [], true);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("typescript error if at least one protection requirement isn't provided", () => {
    renderWithProviders(
      // @ts-expect-error
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { preloadedState: {auth: createAuthState()} }
    );
  });
});
