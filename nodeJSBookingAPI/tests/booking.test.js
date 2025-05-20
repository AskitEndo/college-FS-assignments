const { createBooking, bookings } = require("../bookings");

describe("Booking Conflict Detection", () => {
  beforeEach(() => {
    bookings.clear();
  });

  test("should allow non-conflicting bookings", () => {
    expect(() =>
      createBooking({
        roomId: "1",
        startTime: 9,
        endTime: 10,
        date: "2024-06-01",
      })
    ).not.toThrow();

    expect(() =>
      createBooking({
        roomId: "1",
        startTime: 10,
        endTime: 11,
        date: "2024-06-01",
      })
    ).not.toThrow();
  });

  test("should reject overlapping bookings", () => {
    createBooking({
      roomId: "1",
      startTime: 9,
      endTime: 10,
      date: "2024-06-01",
    });

    expect(() =>
      createBooking({
        roomId: "1",
        startTime: 9.5,
        endTime: 10.5,
        date: "2024-06-01",
      })
    ).toThrow("Time slot already booked");
  });
});
