import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Footer from "./Footer";
describe("Footer component", () => {
  it("renders correctly with all text elements", () => {
    const { getByText } = render(<Footer />);

    expect(getByText("© Copyright 2024 Viridian Sq")).toBeInTheDocument();
    expect(getByText("info@viridiansq.com")).toBeInTheDocument();
    expect(
      getByText(
        "This project was created for educational purposes only by Johanna Petersson"
      )
    ).toBeInTheDocument();
    expect(getByText("Get in touch!")).toBeInTheDocument();
  });

  it("contains a link to the Github page", () => {
    const { getByLabelText } = render(<Footer />);
    const githubLink = getByLabelText(
      "Visit my Github page. Link will open in a new tab."
    );

    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/johannacarolinep"
    );
  });

  it("contains a link to the Linkedin profile", () => {
    const { getByLabelText } = render(<Footer />);
    const linkedinLink = getByLabelText(
      "Visit my Linkedin profile. Link will open in a new tab."
    );

    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/johannapetersson/"
    );
  });
});
