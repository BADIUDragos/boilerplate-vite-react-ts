import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockStoreAuth } from "../../__testUtils__/mockStores";
import { AuthState } from "../../store/interfaces/authInterfaces";
import ProtectedComponent from "../../components/ProtectedComponent";

import "@testing-library/jest-dom/vitest";

describe("ProtectedComponent", () => {
  const setup = (authState: AuthState, requiredPermissions?: string[]) => {
    const store = mockStoreAuth({ auth: authState });
    render(
      <Provider store={store}>
        <ProtectedComponent requiredPermissions={requiredPermissions}>
          <div>Protected Content</div>
        </ProtectedComponent>
      </Provider>
    );
  };

  it("renders children for authorized users", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: "1",
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ["view_content"],
          isSuperuser: false,
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
          id: "1",
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ["other_permission"],
          isSuperuser: false,
        },
      },
      ["view_content"]
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children for staff users regardless of permissions", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: "1",
          username: "superuser",
          email: "user@rolls-royce.com",
          permissions: [],
          isSuperuser: true,
        },
      },
      ["view_content"]
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children when login is not required and user is not logged in", () => {
    setup(
      {
        tokens: null,
        userInfo: null,
      },
      []
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
