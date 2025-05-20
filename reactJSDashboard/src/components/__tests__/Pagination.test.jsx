import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../Pagination";

describe("Pagination", () => {
  const mockProps = {
    page: 2,
    totalPages: 5,
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    goToPage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders page numbers correctly", () => {
    render(<Pagination {...mockProps} />);

    // Should show buttons for pages 1, 2, 3, 5
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("highlights current page", () => {
    render(<Pagination {...mockProps} />);

    // Page 2 should have active class
    const currentPage = screen.getByText("2");
    expect(currentPage.closest("button")).toHaveClass("active");
  });

  test("calls nextPage when next button is clicked", () => {
    render(<Pagination {...mockProps} />);

    fireEvent.click(screen.getByText("»"));

    expect(mockProps.nextPage).toHaveBeenCalledTimes(1);
  });

  test("calls prevPage when previous button is clicked", () => {
    render(<Pagination {...mockProps} />);

    fireEvent.click(screen.getByText("«"));

    expect(mockProps.prevPage).toHaveBeenCalledTimes(1);
  });

  test("calls goToPage with correct page number when page button is clicked", () => {
    render(<Pagination {...mockProps} />);

    fireEvent.click(screen.getByText("3"));

    expect(mockProps.goToPage).toHaveBeenCalledWith(3);
  });

  test("disables previous button on first page", () => {
    render(<Pagination {...{ ...mockProps, page: 1 }} />);

    expect(screen.getByText("«").closest("button")).toBeDisabled();
  });

  test("disables next button on last page", () => {
    render(<Pagination {...{ ...mockProps, page: 5 }} />);

    expect(screen.getByText("»").closest("button")).toBeDisabled();
  });

  test("does not render when there is only 1 page", () => {
    const { container } = render(
      <Pagination {...{ ...mockProps, totalPages: 1 }} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
