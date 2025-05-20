import { useEffect, useState } from "react";
import { getUrgencyScore } from "../utils/sortUtils";

export function useTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set loading state
    setIsLoading(true);

    // Fetch from mockdata.json
    fetch("/data/mockdata.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading tasks:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.priority === filter);

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => getUrgencyScore(a) - getUrgencyScore(b)
  );

  return {
    tasks,
    filter,
    setFilter,
    sortedTasks,
    isLoading,
    error,
  };
}
