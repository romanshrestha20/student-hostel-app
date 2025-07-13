import prisma from "../prisma/client.js";

const isValidDate = (dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date);
};

export const createBooking = async (req, res) => {
  const { roomId, studentId, checkInDate, checkOutDate } = req.body;

  if (!roomId || !studentId || !checkInDate || !checkOutDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  if (new Date(checkInDate) >= new Date(checkOutDate)) {
    return res
      .status(400)
      .json({ error: "Check-in date must be before check-out date" });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        OR: [
          {
            startDate: { lte: new Date(checkOutDate) },
            endDate: { gte: new Date(checkInDate) },
          },
        ],
      },
    });

    if (overlappingBooking) {
      return res
        .status(400)
        .json({ error: "Room is already booked for the selected dates" });
    }
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          roomId,
          studentId,
          startDate: new Date(checkInDate),
          endDate: new Date(checkOutDate),
          status: "pending",
        },
      });

      await tx.room.update({
        where: { id: roomId },
        data: { available: false },
      });

      return newBooking;
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Failed to create booking" });
  }
};

export const getBookingsByStudent = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({ error: "Missing student ID" });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { studentId },
      include: { room: true },
    });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ error: "No bookings found for this student" });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing booking ID" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({ error: "Failed to fetch booking" });
  }
};

export const getBookingsByRoomId = async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ error: "Missing room ID" });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { roomId },
      include: { room: true },
    });

    if (bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found for this room" });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing booking ID" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: true,
        student: true,
      },
    });

    if (bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { roomId, studentId, checkInDate, checkOutDate, status } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing booking ID" });
  }

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const updateData = {};

    // Prepare new values (falling back to existing)
    const newRoomId = roomId || booking.roomId;
    const newStart = checkInDate ? new Date(checkInDate) : booking.startDate;
    const newEnd = checkOutDate ? new Date(checkOutDate) : booking.endDate;

    // Validate dates
    if (newStart >= newEnd) {
      return res
        .status(400)
        .json({ error: "Check-in must be before check-out" });
    }

    // Check for overlapping bookings excluding this booking
    const overlapping = await prisma.booking.findFirst({
      where: {
        roomId: newRoomId,
        id: { not: id },
        startDate: { lte: newEnd },
        endDate: { gte: newStart },
      },
    });

    if (overlapping) {
      return res
        .status(400)
        .json({ error: "Room is already booked for the selected dates" });
    }

    // Apply updates
    updateData.roomId = newRoomId;
    updateData.startDate = newStart;
    updateData.endDate = newEnd;
    if (studentId) updateData.studentId = studentId;
    if (status) updateData.status = status;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return res.status(500).json({ error: "Failed to update booking" });
  }
};
