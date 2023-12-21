import { vi, describe, it, expect } from "vitest";
import { renderWithProviders } from "../__testUtils__/testStores";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import {
  createAuthState,
  loggedOutState,
} from "../store/slices/__tests__/authSetups";

import LoginPage from "./LoginPage";
import { AuthState } from "../store/interfaces/authInterfaces";
import { createTestRouter } from "../__testUtils__/createTestRouter";

const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <div>HomePage</div>,
  },
];

const setup = (authState: { auth: AuthState }) => {
  return renderWithProviders(createTestRouter(routes, "/login"), {
    preloadedState: authState,
  });
};

describe("Testing UI components", () => {
  it("renders the username input", () => {
    setup({ auth: loggedOutState });
    const usernameInput = screen.getByPlaceholderText("Enter Username");
    expect(usernameInput).toBeInTheDocument();
  });

  it("renders the password input", () => {
    setup({ auth: loggedOutState });
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    expect(passwordInput).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    setup({ auth: loggedOutState });
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    expect(submitButton).toBeInTheDocument();
  });

  it("is unaccessible if user is logged in, redirects to home", () => {
    setup({ auth: createAuthState() });
    const homePageText = screen.getByText("HomePage");
    expect(homePageText).toBeInTheDocument();
  });
});

vi.mock("../store/apis/authApi", () => {
  const triggerLogin = vi.fn();
  return {
    useLoginMutation: vi.fn(() => [
      triggerLogin,
      { isLoading: false, error: null },
    ]),
  };
});

describe("Submit functionality", () => {
  it("calls login mutation successfully on submit", async () => {
    setup({ auth: loggedOutState });

    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    await userEvent.type(usernameInput, "username");
    await userEvent.type(passwordInput, "password");
    await userEvent.click(submitButton);

    const { useLoginMutation } = require("../../store/apis/authApi");
    const [triggerLogin] = useLoginMutation();

    expect(triggerLogin).toHaveBeenCalledWith({
      username: "username",
      password: "password",
    });
  });
});
