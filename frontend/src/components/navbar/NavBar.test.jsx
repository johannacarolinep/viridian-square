import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./NavBar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

jest.mock("axios");
jest.mock("../../contexts/CurrentUserContext");

const mockUseCurrentUser = useCurrentUser;

describe("NavBar component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo and navigation links when not logged in", () => {
    mockUseCurrentUser.mockReturnValue(null);

    const { getByAltText, getByText } = render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(getByAltText("Viridian Square logo")).toBeInTheDocument();
    expect(getByText("Discover")).toBeInTheDocument();
    expect(getByText("Sign in")).toBeInTheDocument();
    expect(getByText("Sign up")).toBeInTheDocument();
  });

  it("renders additional links when logged in", () => {
    mockUseCurrentUser.mockReturnValue({
      profile_id: 1,
      profile_image: "profile.jpg",
    });

    const { getByText } = render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(getByText("Create")).toBeInTheDocument();
    expect(getByText("Enquiries")).toBeInTheDocument();
    expect(getByText("Liked")).toBeInTheDocument();
    expect(getByText("Sign out")).toBeInTheDocument();
    expect(getByText("Profile")).toBeInTheDocument();
  });

  it("toggles navbar collapse on button click", () => {
    mockUseCurrentUser.mockReturnValue(null);

    const { getByLabelText, getByText } = render(
      <Router>
        <NavBar />
      </Router>
    );

    const toggleButton = getByLabelText("Toggle navigation");
    fireEvent.click(toggleButton);

    expect(getByText("Discover")).toBeVisible();
  });
});
