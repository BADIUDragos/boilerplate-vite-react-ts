import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../__testUtils__/testStores";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import {
  createAuthState,
  loggedOutState,
} from "../../store/slices/__tests__/authSetups";

import Header from "../Header";
import { Outlet } from "react-router-dom";
import { AuthState, UserInfoState } from "../../store/interfaces/authInterfaces";
import { createTestRouter } from "../../__testUtils__/createTestRouter";

const routes = [
  {
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      { path: "/", element: <div>Home Page</div> },
      { path: "/somepage", element: <div>Any Page</div> },
      { path: "/login", element: <div>Login Page</div> }
    ],
    errorElement: <div>Error Page</div>
  }
];

describe("Header rendering tests", () => {
  const setup = (authState: { auth: AuthState }, route = "/somepage") => {
    return renderWithProviders(
      createTestRouter(routes, route),
      { preloadedState: authState }
    );
  };

  it("renders and navigates to home page when Rolls-Royce logo is clicked", async () => {
    setup({ auth: loggedOutState });

    const logoImage = screen.getByRole("img");
    expect(logoImage).toHaveAttribute("src", "/images/logo.png");

    await userEvent.click(logoImage);

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("displays link to Login page if user isn't signed in", () => {
    setup({ auth: loggedOutState });

    expect(screen.getByText("Login")).toBeInTheDocument;
  });

  it("navigates to login page if user clicks login", async () => {
    setup({ auth: loggedOutState });

    const loginLink = screen.getByRole("link", { name: "Login" });
    await userEvent.click(loginLink as HTMLAnchorElement);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("displays the user's name and Logout if the user is signed in", () => {
    const authState = createAuthState();
    const { userInfo } = authState;
    const { username } = userInfo as UserInfoState;

    setup({ auth: authState });

    const usernameText = screen.getByText(`Hi ${username} !`);

    expect(usernameText).toBeInTheDocument;
    const logout = screen.getByRole("button", { name: "Logout" });
    expect(logout).toBeInTheDocument;
  });

  it("logs out and username is no longer in header", async () => {
    const authState = createAuthState();
    const { userInfo } = authState;
    const { username } = userInfo as UserInfoState;

    setup({ auth: createAuthState() });

    const logout = screen.getByRole("button", { name: "Logout" });

    await userEvent.click(logout);

    const usernameText = screen.queryByText(`Hi ${username} !`);

    expect(usernameText).not.toBeInTheDocument;
    expect(logout).not.toBeInTheDocument;5 
  });

  it("renders app name", async () => {
    setup({ auth: loggedOutState });

    const appText = screen.getByText("Boilerplate APP")

    expect(appText).not.toBeInTheDocument;
  });
});
