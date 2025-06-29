import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByStudent,
  getBookingsByRoomId,
  updateBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { validateBookingData } from "../middlewares/validiators.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();



// Route to get all bookings
router.get("/", getAllBookings);

// Route to get a booking by ID
router.get("/:id", getBookingById);

// Route to get bookings by student ID
router.get("/student/:studentId", getBookingsByStudent);

// Route to get bookings by room ID
router.get("/room/:roomId", getBookingsByRoomId);

// Route to create a new booking
router.post("/", validateBookingData, createBooking);

// Route to update an existing booking
router.put("/:id", validateBookingData, updateBooking);

// Route to delete a booking
router.delete("/:id", cancelBooking);

export default router;
