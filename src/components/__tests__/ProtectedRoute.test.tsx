import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";
import { renderWithProviders } from "../../__testUtils__/testStores";

import "@testing-library/jest-dom/vitest";
import {
  createAuthState,
  createUserInfoState,
  loggedOutState,
} from "../../store/slices/__tests__/authSetups";
import { IProtectedComponentSetupOptions } from "./ProtectedComponent.test";
import { createTestRouter } from "../../__testUtils__/createTestRouter";

describe("ProtectedRoute", () => {
  const setup = (
    options: IProtectedComponentSetupOptions,
    redirectUrl: string = "/login"
  ) => {
    const {
      authState,
      requiredPermissions = [],
      requiredStaff = false,
    } = options;

    const routes = [
      {
        path: "/protected",
        element: (
          <ProtectedRoute
            redirectUrl={redirectUrl}
            requiredPermissions={requiredPermissions}
            requiredStaff={requiredStaff}
          >
            <div>Protected Content</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <div>Login Page</div>,
      },
    ];

    renderWithProviders(createTestRouter(routes, "/protected"), {
      preloadedState: authState,
    });
  };

  it("renders children for authorized users", () => {
    const state = createAuthState();

    setup({
      authState: { auth: state },
      requiredPermissions: ["view_content"],
    });

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("does not render children for unauthorized users", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ permissions: ["other_permissions"] }),
    });

    setup({
      authState: { auth: state },
      requiredPermissions: ["view_content"],
    });

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and permissions required", () => {
    setup({
      authState: { auth: loggedOutState },
      requiredPermissions: ["view_content"],
    });

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in and requiredStaff", () => {
    setup({
      authState: { auth: loggedOutState },
      requiredPermissions: ["view_content"],
      requiredStaff: true,
    });

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("typescript error if at least one protection requirement isn't provided", () => {
    // @ts-expect-error
    <ProtectedRoute>
      <div>Protected Content</div>
    </ProtectedRoute>;
  });
});
