import React, { createContext, useContext } from "react";
import { getUrgencyScore, isOverdue, priorityColor } from "../utils/sortUtils";
import { useTaskManager } from "../hooks/useTaskManager";

// Create context
const TaskContext = createContext(null);

// Provider component
export function TaskProvider({ children }) {
  const {
    tasks,
    filter,
    setFilter,
    sortedTasks,
    isLoading,
    error,
    pagination,
  } = useTaskManager();

  const value = {
    tasks,
    filter,
    setFilter,
    sortedTasks,
    isLoading,
    error,
    pagination,
    // Expose utility functions directly from the context
    utils: { getUrgencyScore, isOverdue, priorityColor },
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// Custom hook for consuming the context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}

const PRIORITY_WEIGHT = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Calculates urgency score for a task.
 * Formula: (days to deadline) / priority weight
 */
export function getUrgencyScore(task) {
  const now = new Date();
  const deadline = new Date(task.deadline);
  const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
  return diffDays / PRIORITY_WEIGHT[task.priority];
}

/**
 * Returns color for a given priority
 */
export function priorityColor(priority) {
  return {
    high: "red",
    medium: "orange",
    low: "green",
  }[priority];
}

/**
 * Checks if the task is overdue
 */
export function isOverdue(deadline) {
  return new Date(deadline) < new Date();
}
