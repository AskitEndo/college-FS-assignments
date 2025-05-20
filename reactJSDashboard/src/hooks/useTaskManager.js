import { useEffect, useState, useCallback } from "react";
import { getUrgencyScore } from "../utils/sortUtils";

// Simple debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const CACHE_KEY = 'task-manager-data';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// New fetchData function with caching
const fetchData = async () => {
  // Check for cached data
  const cachedData = localStorage.getItem(CACHE_KEY);
  
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    const now = new Date().getTime();
    
    // Use cached data if it's not expired
    if (now - timestamp < CACHE_EXPIRY) {
      return data;
    }
  }
  
  // Fetch fresh data if no cache or expired
  const response = await fetch("/data/mockdata.json");
  
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  
  const data = await response.json();
  
  // Store in cache
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data,
    timestamp: new Date().getTime()
  }));
  
  return data;
};

export function useTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedFilter, setDebouncedFilter] = useState(filter);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Show 6 tasks per page

  // Create a debounced filter setter
  const debouncedSetFilter = useCallback(
    debounce((value) => {
      setDebouncedFilter(value);
    }, 300),
    []
  );

  // Update both the immediate and debounced filters
  const handleFilterChange = (value) => {
    setFilter(value); // Update UI immediately
    debouncedSetFilter(value); // Debounce the actual filtering operation
  };

  useEffect(() => {
    // Set loading state
    setIsLoading(true);

    fetchData()
      .then(data => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading tasks:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // Use the debounced filter for actual filtering
  const filteredTasks =
    debouncedFilter === "all"
      ? tasks
      : tasks.filter((t) => t.priority === debouncedFilter);

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => getUrgencyScore(a) - getUrgencyScore(b)
  );

  // Calculate paginated tasks
  const paginatedTasks = sortedTasks.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedTasks.length / pageSize);

  // Page navigation functions
  const nextPage = () => setPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setPage(prev => Math.max(prev - 1, 1));
  const goToPage = (pageNum) => setPage(Math.min(Math.max(1, pageNum), totalPages));

  return {
    tasks,
    filter,
    setFilter: handleFilterChange,
    sortedTasks: paginatedTasks,
    allTasks: sortedTasks, // If you need the full list
    isLoading,
    error,
    pagination: {
      page,
      totalPages,
      nextPage,
      prevPage,
      goToPage,
      setPageSize
    }
  };
}
