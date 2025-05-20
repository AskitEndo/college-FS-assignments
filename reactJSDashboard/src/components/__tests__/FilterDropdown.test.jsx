import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterDropdown from "../FilterDropdown";

describe("FilterDropdown", () => {
  const mockSetFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with current filter selected", () => {
    render(<FilterDropdown filter="medium" setFilter={mockSetFilter} />);

    expect(screen.getByText("Medium Priority")).toBeInTheDocument();
  });

  test("opens dropdown when clicked", () => {
    render(<FilterDropdown filter="all" setFilter={mockSetFilter} />);

    // Menu should be closed initially
    expect(screen.queryByText("High Priority")).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(screen.getByText("All Tasks"));

    // Menu should be open
    expect(screen.getByText("High Priority")).toBeInTheDocument();
    expect(screen.getByText("Medium Priority")).toBeInTheDocument();
    expect(screen.getByText("Low Priority")).toBeInTheDocument();
  });

  test("calls setFilter when option is selected", () => {
    render(<FilterDropdown filter="all" setFilter={mockSetFilter} />);

    // Open dropdown
    fireEvent.click(screen.getByText("All Tasks"));

    // Click on an option
    fireEvent.click(screen.getByText("High Priority"));

    // Should call setFilter
    expect(mockSetFilter).toHaveBeenCalledWith("high");
  });

  test("closes dropdown when option is selected", () => {
    render(<FilterDropdown filter="all" setFilter={mockSetFilter} />);

    // Open dropdown
    fireEvent.click(screen.getByText("All Tasks"));

    // Click on an option
    fireEvent.click(screen.getByText("High Priority"));

    // Dropdown should be closed
    expect(screen.queryByText("Medium Priority")).not.toBeInTheDocument();
  });
});
