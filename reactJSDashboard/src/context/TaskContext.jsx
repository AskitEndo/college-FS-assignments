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
