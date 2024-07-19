import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import CollectionCard from "./CollectionCard";
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockCollection = {
  id: 1,
  owner: "test_user",
  is_owner: true,
  title: "Test Collection",
  description: "This is a test collection",
  created_on: "2022-01-01",
  updated_on: "2022-01-02",
  artpieces: [
    { id: 1, title: "Artpiece 1" },
    { id: 2, title: "Artpiece 2" },
  ],
};

describe("CollectionCard component", () => {
  it("renders correctly with all props", () => {
    const { getByText } = render(
      <Router>
        <CollectionCard
          collection={mockCollection}
          handleDisplayContentChange={jest.fn()}
          handleDeleteConfirm={jest.fn()}
          listPage={true}
        />
      </Router>
    );

    expect(getByText("Test Collection")).toBeInTheDocument();
    expect(getByText("This is a test collection")).toBeInTheDocument();
    expect(getByText("Last updated: 2022-01-02")).toBeInTheDocument();
    expect(getByText("Show")).toBeInTheDocument();
  });

  it("calls handleDisplayContentChange when Show button is clicked", () => {
    const mockHandleDisplayContentChange = jest.fn();
    const { getByText } = render(
      <Router>
        <CollectionCard
          collection={mockCollection}
          handleDisplayContentChange={mockHandleDisplayContentChange}
          handleDeleteConfirm={jest.fn()}
          listPage={true}
        />
      </Router>
    );

    fireEvent.click(getByText("Show"));
    expect(mockHandleDisplayContentChange).toHaveBeenCalledWith(mockCollection);
  });
});
