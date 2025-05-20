import React from "react";
import { isOverdue, priorityColor } from "../utils/sortUtils";
import "../styles/TaskCard.css";

export default function TaskCard({ task, style, className = "" }) {
  const { title, deadline, priority } = task;
  const overdue = isOverdue(deadline);

  // Format date nicely
  const dateObject = new Date(deadline);
  const formattedDate = dateObject.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = dateObject.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate days to deadline
  const now = new Date();
  const diffTime = dateObject - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Get appropriate class for days remaining counter
  const getDaysClass = () => {
    if (diffDays < 0) return "days-past";
    if (diffDays <= 2) return "days-few";
    if (diffDays <= 5) return "days-some";
    return "days-many";
  };

  // Get text for days remaining - more compact
  const getDaysText = () => {
    if (diffDays < 0) return `${Math.abs(diffDays)}d late`;
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1d left";
    return `${diffDays}d left`;
  };

  // Get priority icon
  const getPriorityIcon = () => {
    if (priority === "high") return "🔴";
    if (priority === "medium") return "🟠";
    return "🟢";
  };

  return (
    <div
      className={`task-card ${className}`}
      style={style}
    >
      <div className={`priority-badge ${priority}`}></div>
      
      <div className={`deadline-counter ${getDaysClass()}`}>
        {getDaysText()}
      </div>
      
      <h3 className="task-title">{title}</h3>

      <div className="task-meta">
        <div className="task-info">
          <span className="task-info-icon">📅</span>
          <span>
            {formattedDate} at {formattedTime}
          </span>
        </div>

        <div className="task-info">
          <span className="task-info-icon">{getPriorityIcon()}</span>
          <span className={`task-tag tag-${priority}`}>
            {priority} priority
          </span>
        </div>

        {overdue && (
          <div className="task-overdue">
            <span className="task-info-icon">⚠️</span>
            <span>Task is overdue</span>
          </div>
        )}
      </div>
    </div>
  );
}
