import { useTaskManager } from "./hooks/useTaskManager";
import TaskCard from "./components/TaskCard";
import FilterDropdown from "./components/FilterDropdown";
import "./styles/main.css";

export default function App() {
  const { filter, setFilter, sortedTasks, isLoading, error } = useTaskManager();

  if (isLoading) {
    return (
      <div className="app-container">
        <header className="header">
          <h1 className="app-title">Task Dashboard</h1>
        </header>
        <div className="loader">
          <div className="spinner"></div>
          <p className="loading-text">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <header className="header">
          <h1 className="app-title">Task Dashboard</h1>
        </header>
        <div className="error-container">
          <h2 className="error-title">Error</h2>
          <p>{error}</p>
          <p>Try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="app-title">Task Dashboard</h1>
      </header>
      <FilterDropdown filter={filter} setFilter={setFilter} />
      <div className="masonry-grid">
        {sortedTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          />
        ))}
        {sortedTasks.length === 0 && (
          <div className="no-tasks">
            <h3>No tasks found</h3>
            <p>Try changing your filter or adding new tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
}
