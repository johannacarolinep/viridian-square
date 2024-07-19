import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Avatar from "./Avatar";

describe("Avatar component", () => {
  it("renders an image with the correct src and alt attributes", () => {
    const { getByAltText } = render(<Avatar src="avatar.jpg" />);
    const imgElement = getByAltText("avatar");

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", "avatar.jpg");
    expect(imgElement).toHaveAttribute("alt", "avatar");
  });

  it("renders the text correctly", () => {
    const { getByText } = render(<Avatar text="User Name" />);
    const textElement = getByText("User Name");

    expect(textElement).toBeInTheDocument();
  });

  it("applies default height if not provided", () => {
    const { getByAltText } = render(<Avatar src="avatar.jpg" />);
    const imgElement = getByAltText("avatar");

    expect(imgElement).toHaveAttribute("height", "45");
    expect(imgElement).toHaveAttribute("width", "45");
  });

  it("applies custom height if provided", () => {
    const { getByAltText } = render(<Avatar src="avatar.jpg" height={100} />);
    const imgElement = getByAltText("avatar");

    expect(imgElement).toHaveAttribute("height", "100");
    expect(imgElement).toHaveAttribute("width", "100");
  });
});
