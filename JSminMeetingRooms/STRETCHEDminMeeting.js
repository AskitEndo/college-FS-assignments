function scheduleMeetingRooms(meetings) {
  if (!meetings.length) return { roomCount: 0, assignments: [] };

  // Keep track of original indices and sort by start time
  const scheduledMeetings = meetings.map((meeting, idx) => ({
    ...meeting,
    id: idx,
  }));
  scheduledMeetings.sort((a, b) => a.start - b.start);

  // Use min-heap to track room availability by end time
  const activeRooms = [];
  const roomAssignments = new Array(meetings.length);
  let roomCounter = 1;

  for (const meeting of scheduledMeetings) {
    // Find available room with earliest end time
    let roomAssigned = false;

    // Sort rooms by end time (most efficient would use a priority queue)
    activeRooms.sort((a, b) => a.endTime - b.endTime);

    // Check if earliest ending room is now available
    if (activeRooms.length > 0 && activeRooms[0].endTime <= meeting.start) {
      const availableRoom = activeRooms.shift();
      availableRoom.endTime = meeting.end;
      roomAssignments[meeting.id] = availableRoom.roomId;
      activeRooms.push(availableRoom);
      roomAssigned = true;
    }

    // If no available room found, create a new one
    if (!roomAssigned) {
      activeRooms.push({ endTime: meeting.end, roomId: roomCounter });
      roomAssignments[meeting.id] = roomCounter;
      roomCounter++;
    }
  }

  return {
    roomCount: activeRooms.length,
    assignments: roomAssignments,
  };
}

// Example usage
const meetings = [
  { start: 0, end: 30 },
  { start: 5, end: 10 },
  { start: 15, end: 20 },
];

const result = scheduleMeetingRooms(meetings);
console.log("Rooms needed:", result.roomCount);
console.log("Room assignments:", result.assignments);
