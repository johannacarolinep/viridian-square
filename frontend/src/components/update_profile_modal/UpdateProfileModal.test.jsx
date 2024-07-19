import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateProfileModal from "./UpdateProfileModal";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("UpdateProfileModal component", () => {
  const mockHandleClose = jest.fn();
  const mockUser = {
    profile_id: 1,
    profile_name: "temporary_name",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with user data", () => {
    const { getByText } = render(
      <Router>
        <UpdateProfileModal
          show={true}
          handleClose={mockHandleClose}
          user={mockUser}
        />
      </Router>
    );

    expect(getByText("Complete your profile")).toBeInTheDocument();
    expect(getByText("temporary_name")).toBeInTheDocument();
    expect(getByText("Skip for now")).toBeInTheDocument();
    expect(getByText("Complete profile")).toBeInTheDocument();
  });

  it("calls handleClose when 'Skip for now' button is clicked", () => {
    const { getByText } = render(
      <Router>
        <UpdateProfileModal
          show={true}
          handleClose={mockHandleClose}
          user={mockUser}
        />
      </Router>
    );

    const skipButton = getByText("Skip for now");
    fireEvent.click(skipButton);

    expect(mockHandleClose).toHaveBeenCalled();
  });
});
