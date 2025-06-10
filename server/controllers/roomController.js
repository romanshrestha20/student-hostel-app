import prisma from "../prisma/client.js";

// Utility: Validate required fields for room creation/update
const validateRoomData = (data) => {
  const { hostelId, roomType, price, capacity } = data;
  if (
    !hostelId ||
    !roomType ||
    price === undefined ||
    isNaN(price) ||
    capacity === undefined ||
    isNaN(capacity)
  ) {
    return false;
  }
  return true;
};

// GET /rooms - Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      select: {
        id: true,
        roomType: true,
        price: true,
        capacity: true,
        available: true,
        amenities: true,
        hostelId: true,
        hostel: true,
        photos: true,
        favorites: true,
      },
    });

    res.status(200).json({
      message: "Rooms fetched successfully",
      rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// GET /rooms/:id - Get room by ID
export const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        hostelId: true,
        roomType: true,
        price: true,
        capacity: true,
        available: true,
        amenities: true,
        photos: true,
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({
      message: "Room fetched successfully",
      room,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
};

// POST /rooms - Create a new room
export const createRoom = async (req, res) => {
  try {
    const { hostelId, roomType, price, capacity, available = true, amenities = [] } = req.body;

    if (!validateRoomData(req.body)) {
      return res.status(400).json({ error: "Missing or invalid required fields: hostelId, roomType, price, capacity" });
    }

    // Verify the hostel exists
    const hostel = await prisma.hostel.findUnique({ where: { id: hostelId } });
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    const newRoom = await prisma.room.create({
      data: {
        hostelId,
        roomType,
        price,
        capacity,
        available,
        amenities,
      },
    });

    res.status(201).json({
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
};

// PUT /rooms/:id - Update a room by ID
export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { hostelId, roomType, price, capacity, available, amenities } = req.body;

    // Check if room exists first
    const existingRoom = await prisma.room.findUnique({ where: { id: roomId } });
    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Validate required fields only if present (allow partial updates)
    if (
      (hostelId !== undefined && !hostelId) ||
      (roomType !== undefined && !roomType) ||
      (price !== undefined && (isNaN(price) || price === null)) ||
      (capacity !== undefined && (isNaN(capacity) || capacity === null))
    ) {
      return res.status(400).json({ error: "Invalid fields in update" });
    }

    // If hostelId is being updated, check if that hostel exists
    if (hostelId && hostelId !== existingRoom.hostelId) {
      const hostel = await prisma.hostel.findUnique({ where: { id: hostelId } });
      if (!hostel) {
        return res.status(404).json({ error: "Hostel not found" });
      }
    }

    // Build update data dynamically
    const updateData = {};
    if (hostelId) updateData.hostelId = hostelId;
    if (roomType) updateData.roomType = roomType;
    if (price !== undefined) updateData.price = price;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (available !== undefined) updateData.available = available;
    if (amenities !== undefined) updateData.amenities = amenities;

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: updateData,
    });

    res.status(200).json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
};

// DELETE /rooms/:id - Delete a room by ID
export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    // Check if room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const deletedRoom = await prisma.room.delete({
      where: { id: roomId },
    });

    res.status(200).json({
      message: "Room deleted successfully",
      room: deletedRoom,
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
};
