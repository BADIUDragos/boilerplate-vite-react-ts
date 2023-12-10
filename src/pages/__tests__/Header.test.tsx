import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../__testUtils__/testStores";
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  createAuthState,
  createUserInfoState,
  loggedOutState,
} from "../../__testUtils__/sliceSetups/auth";

import Header from "../../components/Header";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthState } from "../../store/interfaces/authInterfaces";

describe('Header rendering tests', () => {

  const setup = (authState : {auth: AuthState}) => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/header"]}>
        <Routes>
          <Route path="/header" element={<><Header/><div>Any Page</div></>}/>
          <Route path="/login" element={<><Header/><div>Login Page</div></>} />
          <Route path="/" element={<><Header/><div>Home Page</div></>} />
        </Routes>
      </MemoryRouter>, 
      {preloadedState: authState}
    )
  }

  it("renders the Rolls-Royce logo correctly", () => {
    setup({auth: loggedOutState})

    expect(screen.getByRole
      ('img')).toHaveAttribute("src", "/images/logo.png" )
  })

  it("navigates to home page when Rolls-Royce logo is clicked", () => {
    setup({auth: loggedOutState})

    const logoImage = screen.getByRole
    ('img')


  

    expect(screen.getByText("Home Page")).toBeInTheDocument()
  })
 
  


})