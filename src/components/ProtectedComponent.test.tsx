import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { AuthState } from "../store/interfaces/authInterfaces";
import ProtectedComponent from "./ProtectedComponent";
import { renderWithProviders } from "../__testUtils__/testStores";

import "@testing-library/jest-dom/vitest";
import {
  createAuthState,
  createUserInfoState,
  loggedOutState,
} from "../store/slices/__tests__/authSetups";

describe("ProtectedComponent", () => {
  const setup = (
    authState: { auth: AuthState },
    requiredPermissions: string[] = [],
    requiredStaff: boolean = false
  ) => {
    renderWithProviders(
      <>
        test
        <ProtectedComponent
          requiredPermissions={requiredPermissions}
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

    setup({ auth: state }, ["view_content"]), false;

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

  it("typescript error if at least one protection requirement isn't provided", () => {
    renderWithProviders(
      // @ts-expect-error
      <ProtectedComponent>
        <div>Protected Content</div>
      </ProtectedComponent>,
      { preloadedState: {auth: createAuthState()} }
    );
  });
});
