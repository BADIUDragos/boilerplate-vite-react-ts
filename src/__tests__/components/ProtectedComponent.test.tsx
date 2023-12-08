import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { AuthState } from "../../store/interfaces/authInterfaces";
import ProtectedComponent from "../../components/ProtectedComponent";
import { renderWithProviders } from "../../__testUtils__/testStores";

import "@testing-library/jest-dom/vitest";
import {
  createAuthState,
  createUserInfoState,
} from "../../__testUtils__/sliceSetups/auth";

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

  it("requires at least one requirement", () => {
    const state = createAuthState({
      userInfo: createUserInfoState({ permissions: ["other_permissions"] }),
    });

    setup({ auth: state }, ["view_content"]);

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
