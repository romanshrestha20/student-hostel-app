import prisma from "../prisma/client.js";


export const createBooking = async (req, res) => {
  const { roomId, studentId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { available: true },
    });

    if (!room || !room.available) {
      return res.status(404).json({ error: "Room not found or not available" });
    }

    const booking = await prisma.booking.create({
      data: {
        roomId,
        studentId,
        startDate: new Date(checkInDate),
        endDate: new Date(checkOutDate),
      },
    });

    await prisma.room.update({
      where: { id: roomId },
      data: { available: false },
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const getBookingsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: { studentId },
      include: {
        room: true, // Include room details
      },
    });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ error: "No bookings found for this student" });
    }

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: true, // Include room details
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking fetched successfully",
      booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

export const getBookingsByRoomId = async (req, res) => {
  const { roomId } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: { roomId },
      include: {
        room: true, // Include room details
      },
    });

    if (bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found for this room" });
    }

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { roomId: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id },
    });

    // Update room availability
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { available: true },
    });

    res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: true, // Include room details
        student: true, // Include student details
      },
    });

    if (bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};



export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { roomId, studentId, checkInDate, checkOutDate, status } = req.body;

  console.log("Update booking request body:", req.body);

  try {
    // Check if booking exists
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Prepare update data only with fields provided in the request
    const updateData = {};

    if (roomId) updateData.roomId = roomId;
    if (studentId) updateData.studentId = studentId;
    if (checkInDate) updateData.startDate = new Date(checkInDate);
    if (checkOutDate) updateData.endDate = new Date(checkOutDate);
    if (status) updateData.status = status;

    // If no fields to update, return bad request
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update" });
    }

    // Update booking record
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
};
