import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { AuthState } from "../../store/interfaces/authInterfaces";
import ProtectedComponent from "../../components/ProtectedComponent";
import { renderWithProviders } from "../../__testUtils__/testStores";

import "@testing-library/jest-dom/vitest";
import {
  createAuthState,
  createUserInfoState,
  loggedOutState,
} from "../../__testUtils__/sliceTestSetups/auth";

describe("ProtectedComponent", () => {
  const setup = (
    authState: { auth: AuthState },
    requiredPermissions: string[] = [],
    requiredSuperUser: boolean = false,
    requiredStaff: boolean = false
  ) => {
    renderWithProviders(
      <>
        test
        <ProtectedComponent
          requiredPermissions={requiredPermissions}
          requiredSuperUser={requiredSuperUser}
          requiredStaff={requiredStaff}
        >
          <div>Protected Content</div>
        </ProtectedComponent>
      </>,
      { preloadedState: authState }
    );
  };

  it("renders children for authorized users", () => {
    const state = createAuthState();

    setup({ auth: state }, ["view_content"]), ["view_content"];

    screen.debug();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("does not render children for unauthorized users", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ permissions: ["other_permissions"] }),
    });

    setup({ auth: state }, ["view_content"]);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children for superuser users regardless of permissions", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ isSuperuser: true, permissions: [] }),
    });

    setup({ auth: state }, ["view_content"]);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("doesn't render children if requiredSuperuser and user is not superUser", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ permissions: [] }),
    });

    setup({ auth: state }, [], true);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("doesn't render children if requiredSuperuser and user is just staff", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ isStaff: true }),
    });

    setup({ auth: state }, ["view_content"], true);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children for staff users when requiredStaff and has all permissions", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ isStaff: true }),
    });

    setup({ auth: state }, ["view_content"], false, true);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("doesn't render children for staff users if not all permissions", async () => {
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
});
