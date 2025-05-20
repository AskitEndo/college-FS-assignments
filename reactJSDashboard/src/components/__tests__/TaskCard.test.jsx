import React from "react";
import { render, screen } from "@testing-library/react";
import TaskCard from "../TaskCard";
import * as sortUtils from "../../utils/sortUtils";

// Mock the sortUtils functions
jest.mock("../../utils/sortUtils", () => ({
  isOverdue: jest.fn(),
  priorityColor: jest.fn(),
}));

describe("TaskCard", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    deadline: "2025-05-20T14:00:00Z",
    priority: "high",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    sortUtils.isOverdue.mockReturnValue(false);
    sortUtils.priorityColor.mockReturnValue("red");
  });

  test("renders task details correctly", () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    // Should show formatted date
    expect(screen.getByText(/at 14:00/i)).toBeInTheDocument();
  });

  test("shows overdue warning when task is overdue", () => {
    sortUtils.isOverdue.mockReturnValue(true);

    render(<TaskCard task={mockTask} />);

    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  test("does not show overdue warning when task is not overdue", () => {
    sortUtils.isOverdue.mockReturnValue(false);

    render(<TaskCard task={mockTask} />);

    expect(screen.queryByText("Overdue")).not.toBeInTheDocument();
  });

  test("applies correct priority styling", () => {
    render(<TaskCard task={mockTask} />);

    const card = screen.getByText("Test Task").closest(".task-card");
    expect(card).toHaveClass("priority-high");
  });

  test("shows days remaining indicator", () => {
    // Mock current date
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => new Date("2025-05-18T00:00:00Z"));

    render(<TaskCard task={mockTask} />);

    // Task is 2 days away
    expect(screen.getByText("2d")).toBeInTheDocument();

    jest.restoreAllMocks();
  });
});
