const { v4: uuidv4 } = require("crypto"); // native UUID alternative using crypto.randomUUID in newer versions

const bookings = new Map(); // { id => { roomId, startTime, endTime, date } }

function createBooking({ roomId, startTime, endTime, date }) {
  const id = crypto.randomUUID();
  const newBooking = { id, roomId, startTime, endTime, date };

  // Conflict detection
  for (const [, booking] of bookings) {
    if (
      booking.roomId === roomId &&
      booking.date === date &&
      !(endTime <= booking.startTime || startTime >= booking.endTime)
    ) {
      throw new Error("Time slot already booked");
    }
  }

  bookings.set(id, newBooking);
  return newBooking;
}

function getFreeSlots(date, roomId) {
  // Define 9AM - 5PM (Example)
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push({ start: hour, end: hour + 1 });
  }

  for (const [, booking] of bookings) {
    if (booking.date === date && booking.roomId === roomId) {
      slots.splice(
        slots.findIndex(
          (s) => s.start === booking.startTime && s.end === booking.endTime
        ),
        1
      );
    }
  }

  return slots;
}

function updateBooking(id, newDetails) {
  if (!bookings.has(id)) throw new Error("Booking not found");
  bookings.delete(id); // Temporarily remove to re-check for conflict
  try {
    const newBooking = createBooking({ ...newDetails });
    bookings.set(id, newBooking);
    return newBooking;
  } catch (err) {
    throw err;
  }
}

function deleteBooking(id) {
  if (!bookings.has(id)) throw new Error("Booking not found");
  return bookings.delete(id);
}

module.exports = {
  createBooking,
  getFreeSlots,
  updateBooking,
  deleteBooking,
  bookings, // Export for testing
};
