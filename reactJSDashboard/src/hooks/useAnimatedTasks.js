import { useState, useEffect } from 'react';

export function useAnimatedTasks(tasks) {
  const [animatedTasks, setAnimatedTasks] = useState(tasks);
  const [reordering, setReordering] = useState({});

  // Track tasks that change position
  useEffect(() => {
    // Map current positions
    const currentPositions = {};
    animatedTasks.forEach((task, index) => {
      currentPositions[task.id] = index;
    });

    // Identify tasks that moved
    const movedTasks = {};
    tasks.forEach((task, newIndex) => {
      const oldIndex = currentPositions[task.id];
      if (oldIndex !== undefined && oldIndex !== newIndex) {
        movedTasks[task.id] = true;
      }
    });

    // Update animated tasks and mark reordering tasks
    setAnimatedTasks(tasks);
    setReordering(movedTasks);

    // Clear reordering flags after animation completes
    if (Object.keys(movedTasks).length > 0) {
      const timeoutId = setTimeout(() => {
        setReordering({});
      }, 1500); // Match the highlight animation duration
      return () => clearTimeout(timeoutId);
    }
  }, [tasks]);

  return { animatedTasks, reordering };
}