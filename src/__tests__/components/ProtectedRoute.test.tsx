import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthState } from "../../store/interfaces/authInterfaces";
import ProtectedRoute from "../../components/ProtectedRoute";
import { authStoreWithPreloadedState } from "../../__testUtils__/mockStores";

import "@testing-library/jest-dom/vitest";

describe("ProtectedRoute", () => {
  const required = "default_test_filler_for_at_least_one_required";

  const setup = (
    authState: AuthState,
    requiredPermissions: string[] = [required],
    requiredSuperUser: boolean = false,
    requiredStaff: boolean = false,
    redirectUrl: string = "/login"
  ) => {
    const store = authStoreWithPreloadedState({ auth: authState });
    render(
      <Provider store={store}>
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
        </MemoryRouter>
      </Provider>
    );
  };

  it("renders children for authorized users", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ["view_content"],
          isSuperuser: false,
          isStaff: false,
        },
      },
      ["view_content"]
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("does not render children for unauthorized users", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ["other_permission"],
          isSuperuser: false,
          isStaff: false,
        },
      },
      ["view_content"]
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children for super users regardless of permissions", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "staff",
          email: "user@rolls-royce.com",
          permissions: [],
          isSuperuser: true,
          isStaff: false,
        },
      },
      ["view_content"]
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children for staff when requiredStaff and has all permissions", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "staff",
          email: "user@rolls-royce.com",
          permissions: ['view_content'],
          isSuperuser: false,
          isStaff: true,
        },
      },
      ["view_content"], false, true
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
  
  it("doesn't renders children for staff when required staff and no permissions", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "staff",
          email: "user@rolls-royce.com",
          permissions: [],
          isSuperuser: false,
          isStaff: true,
        },
      },
      ["view_content"], false, true
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("doesn't render children if requiredSuperUser and user is not superUser", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ['view_content'],
          isSuperuser: false,
          isStaff: false,
        },
      },
      ["view_content"], true, false
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("doesn't render children if requiredSuperUser and user is just staff", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ['view_content'],
          isSuperuser: false,
          isStaff: true,
        },
      },
      ["view_content"], true, false
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("doesn't render children if requiredStaff and user is not staff", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ['view_content'],
          isSuperuser: false,
          isStaff: false,
        },
      },
      ["view_content"], false, true
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when login is not required and user is not logged in", () => {
    setup(
      {
        tokens: null,
        userInfo: null,
      },
      [],
      false
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and permissions required", () => {
    setup(
      {
        tokens: null,
        userInfo: null,
      },
      ["view_content"]
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and requiredSuperUser", () => {
    setup(
      {
        tokens: null,
        userInfo: null,
      },
      [], true
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and requiredStaff", () => {
    setup(
      {
        tokens: null,
        userInfo: null,
      },
      [], false, true
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
