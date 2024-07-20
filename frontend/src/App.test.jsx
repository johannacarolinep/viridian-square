import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

describe("App component", () => {
  it("renders without crashing", () => {
    render(
      <Router>
        <App />
      </Router>
    );
  });

  it("contains the NavBar component", () => {
    const { getByRole } = render(
      <Router>
        <App />
      </Router>
    );
    expect(getByRole("navigation")).toBeInTheDocument();
  });

  it("contains the Footer component", () => {
    const { getByText } = render(
      <Router>
        <App />
      </Router>
    );
    // Adjust the text to match what's actually rendered in the footer
    expect(getByText(/© Copyright 2024 Viridian Sq/i)).toBeInTheDocument();
    expect(getByText(/info@viridiansq.com/i)).toBeInTheDocument();
  });
});
