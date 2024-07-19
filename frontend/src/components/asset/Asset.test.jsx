import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Asset from "./Asset";

describe("Asset component", () => {
  it("renders image when src prop is provided", () => {
    const { getByAltText } = render(
      <Asset src="image.jpg" message="Test image" />
    );
    const imgElement = getByAltText("Test image");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", "image.jpg");
  });

  it("renders message when message prop is provided", () => {
    const { getByText } = render(<Asset message="Test message" />);
    expect(getByText("Test message")).toBeInTheDocument();
  });

  it("renders all elements when all props are provided", () => {
    const { getByAltText, getByText } = render(
      <Asset spinner={true} src="image.jpg" message="Test message" />
    );
    expect(getByAltText("Test message")).toBeInTheDocument();
    expect(getByText("Test message")).toBeInTheDocument();
  });
});
