import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  AuthState,
  UserInfoState,
} from "../../store/interfaces/authInterfaces";
import ProtectedRoute from "../../components/ProtectedRoute";
import { renderWithProviders } from "../../__testUtils__/testStores";

import "@testing-library/jest-dom/vitest";
import {
  createAuthState,
  createUserInfoState,
} from "../../__testUtils__/functions";

const loggedOutState = {
  tokens: null,
  userInfo: null,
};

describe("ProtectedRoute", () => {
  const setup = (
    authState: { auth: AuthState },
    requiredPermissions: string[] = [],
    requiredSuperUser: boolean = false,
    requiredStaff: boolean = false,
    redirectUrl: string = "/login"
  ) => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                redirectUrl={redirectUrl}
                requiredPermissions={requiredPermissions}
                requiredSuperUser={requiredSuperUser}
                requiredStaff={requiredStaff}
              >
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
      { preloadedState: authState }
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

  it("renders children for super users regardless of permissions", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ isSuperuser: true, permissions: [] }),
    });

    setup({ auth: state }, ["view_content"]);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children for staff when requiredStaff and has all permissions", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ isStaff: true }),
    });

    setup({ auth: state }, ["view_content"], false, true);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("doesn't renders children for staff when required staff and no permissions", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ isStaff: true, permissions: [] }),
    });

    setup({ auth: state }, ["view_content"], false, true);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("doesn't render children if requiredSuperUser and user is not superUser", () => {
    const state = createAuthState();

    setup({ auth: state }, ["view_content"], true, false);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("doesn't render children if requiredSuperUser and user is just staff", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ isStaff: true }),
    });

    setup({ auth: state }, ["view_content"], true, false);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("doesn't render children if requiredStaff and user is not staff", () => {
    const state = createAuthState();

    setup({ auth: state }, ["view_content"], false, true);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when login is not required and user is not logged in", () => {
    setup({ auth: loggedOutState }, [], false);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and permissions required", () => {
    setup({ auth: loggedOutState }, ["view_content"]);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and requiredSuperUser", () => {
    setup({ auth: loggedOutState }, [], true);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and requiredStaff", () => {
    setup({ auth: loggedOutState }, [], false, true);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
