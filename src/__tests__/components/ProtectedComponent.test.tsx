import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { authStoreWithPreloadedState } from "../../__testUtils__/mockStores";
import { AuthState } from "../../store/interfaces/authInterfaces";
import ProtectedComponent from "../../components/ProtectedComponent";

import "@testing-library/jest-dom/vitest";


describe("ProtectedComponent", () => {

  const required = 'default_test_filler_for_at_least_one_required'

  const setup = (authState: AuthState, requiredPermissions: string[] = [required], requiredSuperUser?: boolean, requiredStaff?: boolean) => {
    const store = authStoreWithPreloadedState({ auth: authState });
    render(
      <Provider store={store}>
        test
        <ProtectedComponent requiredPermissions={requiredPermissions} requiredSuperUser={requiredSuperUser} requiredStaff={requiredStaff}>
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
          id: 1,
          username: "user",
          email: "user@rolls-royce.com",
          permissions: ["view_content"],
          isSuperuser: false,
          isStaff: false
        },
      },
      ["view_content"], false, false
    );

    screen.debug()
    expect(screen.getByText("test")).toBeInTheDocument();
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
          isStaff: false
        },
      },
      ["view_content"]
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children for superuser users regardless of permissions", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "staff",
          email: "user@rolls-royce.com",
          permissions: [],
          isSuperuser: true,
          isStaff: true
        },
      },
      ["view_content"]
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children for staff users when requiredStaff regardless of permissions", () => {
    setup(
      {
        tokens: { access: "mock_access_token", refresh: "mock_refresh_token" },
        userInfo: {
          id: 1,
          username: "staff",
          email: "user@rolls-royce.com",
          permissions: [],
          isSuperuser: false,
          isStaff: true
        },
      },
      ["view_content"], false, true
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children when nothing is required and user is not logged in", () => {
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
