import { useTaskManager } from "./hooks/useTaskManager";
import { useAnimatedTasks } from "./hooks/useAnimatedTasks";
import TaskCard from "./components/TaskCard";
import FilterDropdown from "./components/FilterDropdown";
import Pagination from "./components/Pagination";
import "./styles/main.css";

export default function App() {
  const { filter, setFilter, sortedTasks, isLoading, error, pagination, tasks } =
    useTaskManager();

  // Add animated reordering
  const { animatedTasks, reordering } = useAnimatedTasks(sortedTasks);

  // Calculate stats
  const calculateStats = () => {
    if (!tasks.length) return { total: 0, high: 0, medium: 0, low: 0, overdue: 0 };
    
    return tasks.reduce((stats, task) => {
      stats.total++;
      stats[task.priority]++;
      
      if (new Date(task.deadline) < new Date()) {
        stats.overdue++;
      }
      
      return stats;
    }, { total: 0, high: 0, medium: 0, low: 0, overdue: 0 });
  };
  
  const stats = calculateStats();
  
  // Handle stat card click to filter tasks
  const handleStatCardClick = (filterValue) => {
    // If already selected, reset to "all"
    if (filter === filterValue) {
      setFilter("all");
    } else {
      setFilter(filterValue);
    }
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <header className="header">
          <h1 className="app-title">Task Dashboard</h1>
        </header>
        <div className="loader">
          <div className="spinner"></div>
          <p className="loading-text">Loading your tasks...</p>
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
          <h2 className="error-title">Error Loading Tasks</h2>
          <p>{error}</p>
          <p>Try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="app-title">Task Dashboard</h1>
      </header>
      
      {/* Stats Section */}
      <div className="dashboard-stats">
        <div 
          className={`stat-card ${filter === "all" ? "active" : ""}`}
          onClick={() => handleStatCardClick("all")}
          title="Show all tasks"
        >
          <div className="stat-title">📋 Total Tasks</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div 
          className={`stat-card ${filter === "high" ? "active" : ""}`}
          onClick={() => handleStatCardClick("high")}
          title="Filter high priority tasks"
        >
          <div className="stat-title">🔴 High Priority</div>
          <div className="stat-value">{stats.high}</div>
        </div>
        <div 
          className={`stat-card ${filter === "medium" ? "active" : ""}`}
          onClick={() => handleStatCardClick("medium")}
          title="Filter medium priority tasks"
        >
          <div className="stat-title">🟠 Medium Priority</div>
          <div className="stat-value">{stats.medium}</div>
        </div>
        <div 
          className={`stat-card ${filter === "low" ? "active" : ""}`}
          onClick={() => handleStatCardClick("low")}
          title="Filter low priority tasks"
        >
          <div className="stat-title">🟢 Low Priority</div>
          <div className="stat-value">{stats.low}</div>
        </div>
        {/* Overdue card is not clickable as it's not a priority filter */}
        <div className="stat-card">
          <div className="stat-title">⏰ Overdue</div>
          <div className="stat-value">{stats.overdue}</div>
        </div>
      </div>
      
      <FilterDropdown filter={filter} setFilter={setFilter} />
      
      <div className="masonry-grid">
        {animatedTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
            className={reordering[task.id] ? 'reordering' : ''}
          />
        ))}
        {animatedTasks.length === 0 && (
          <div className="no-tasks">
            <h3>No tasks found</h3>
            <p>Try changing your filter or adding new tasks.</p>
          </div>
        )}
      </div>

      {pagination && animatedTasks.length > 0 && <Pagination {...pagination} />}
    </div>
  );
}
