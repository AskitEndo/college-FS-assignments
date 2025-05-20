function findMinRooms(meetings) {
  // Handle edge case
  if (!meetings.length) return 0;

  // Create separate arrays for start and end times
  const startTimes = meetings.map((meeting) => meeting.start);
  const endTimes = meetings.map((meeting) => meeting.end);

  // Sort both arrays
  startTimes.sort((a, b) => a - b);
  endTimes.sort((a, b) => a - b);

  let roomsNeeded = 0;
  let maxRooms = 0;
  let startPointer = 0;
  let endPointer = 0;

  // Use two-pointer approach to track overlapping meetings
  while (startPointer < meetings.length) {
    // If the earliest meeting end time is after current meeting start time
    // we need a new room
    if (startTimes[startPointer] < endTimes[endPointer]) {
      roomsNeeded++;
      startPointer++;
    }
    // If a meeting has ended before or at the start of current meeting,
    // we can reuse that room
    else {
      roomsNeeded--;
      endPointer++;
    }

    // Keep track of maximum rooms needed at any point
    maxRooms = Math.max(maxRooms, roomsNeeded);
  }

  return maxRooms;
}

// Test cases
console.log(findMinRooms([])); // 0
console.log(findMinRooms([{ start: 1, end: 5 }])); // 1
console.log(
  findMinRooms([
    { start: 1, end: 2 },
    { start: 3, end: 4 },
  ])
); // 1
console.log(
  findMinRooms([
    { start: 1, end: 4 },
    { start: 2, end: 5 },
    { start: 6, end: 8 },
  ])
); // 2
