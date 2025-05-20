const express = require("express");
const router = express.Router();
const {
  createBooking,
  getFreeSlots,
  updateBooking,
  deleteBooking,
} = require("./bookings");

// POST /bookings
router.post("/bookings", (req, res) => {
  try {
    const booking = createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

// GET /slots?date=YYYY-MM-DD&roomId=...
router.get("/slots", (req, res) => {
  const { date, roomId } = req.query;
  const slots = getFreeSlots(date, roomId);
  res.json(slots);
});

// PUT /bookings/:id
router.put("/bookings/:id", (req, res) => {
  try {
    const booking = updateBooking(req.params.id, req.body);
    res.json(booking);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

// DELETE /bookings/:id
router.delete("/bookings/:id", (req, res) => {
  try {
    deleteBooking(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
