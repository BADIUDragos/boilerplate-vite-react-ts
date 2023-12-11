import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../__testUtils__/testStores";
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  createAuthState,
  loggedOutState,
} from "../../__testUtils__/sliceSetups/auth";

import Header from "../../components/Header";
import { Route, Routes } from "react-router-dom";
import { AuthState } from "../../store/interfaces/authInterfaces";

describe("Header rendering tests", () => {
  const setup = (authState: { auth: AuthState }, route = "/somepage") => {
    return renderWithProviders(
      <Routes>
        <Route
          path="/somepage"
          element={
            <>
              <Header />
              <div>Any Page</div>
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <div>Login Page</div>
            </>
          }
        />
        <Route
          path="/"
          element={
            <>
              <Header />
              <div>Home Page</div>
            </>
          }
        />
      </Routes>,
      { preloadedState: authState, route: route }
    );
  };

  it("renders the Rolls-Royce logo correctly", () => {
    setup({ auth: loggedOutState });

    expect(screen.getByRole("img")).toHaveAttribute("src", "/images/logo.png");
  });

  it("navigates to home page when Rolls-Royce logo is clicked", () => {
    setup({ auth: loggedOutState });

    const logoImage = screen.getByRole("img");

    fireEvent.click(logoImage);

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("displays link to Login page if user isn't signed in", () => {
    setup({ auth: loggedOutState });

    expect(screen.getByText("Login")).toBeInTheDocument;
  });

  it("navigates to login page if user clicks login", async () => {
    setup({ auth: loggedOutState });

    const loginLink = screen.getByText("Login").closest("a");
    fireEvent.click(loginLink as HTMLAnchorElement);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("displays Logout if the user is signed in", () => {
    setup({ auth: createAuthState() });

    const logout = screen.getByText("Logout");
    expect(logout).toBeInTheDocument;
  });

  it("logs out and redirects to home page if the user clicks logout", () => {
    setup({ auth: createAuthState() });

    const logout = screen.getByText("Logout");

    fireEvent.click(logout);

    expect(logout).not.toBeInTheDocument;
    expect(screen.getByText("Home Page")).toBeInTheDocument;
  });
});
