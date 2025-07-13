import prisma from "../prisma/client.js";
import { validateRoomData, validateUpdateRoomData } from "../middlewares/validiators.js";

// GET /rooms - Get all rooms with pagination
export const getAllRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          roomType: true,
          price: true,
          capacity: true,
          available: true,
          amenities: true,
          hostelId: true,
          hostel: true,
          favorites: true,
        },
      }),
      prisma.room.count(),
    ]);

    res.status(200).json({
      message: "Rooms fetched successfully",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// GET /rooms/type?roomType=X - Get rooms by room type
export const getRoomsByRoomType = async (req, res) => {
  try {
    const { roomType } = req.query;

    if (!roomType) {
      return res.status(400).json({ error: "Room type is required" });
    }

    const rooms = await prisma.room.findMany({
      where: { roomType },
      select: {
        id: true,
        hostelId: true,
        roomType: true,
        price: true,
        capacity: true,
        available: true,
        amenities: true,

      },
    });

    if (rooms.length === 0) {
      return res.status(404).json({ error: "No rooms found for this room type" });
    }

    res.status(200).json({
      message: "Rooms fetched successfully",
      rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms by type:", error);
    res.status(500).json({ error: "Failed to fetch rooms by type" });
  }
};

// GET /rooms/hostel/:hostelId - Get rooms by hostel
export const getAllRoomsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const rooms = await prisma.room.findMany({
      where: { hostelId },
      select: {
        id: true,
        roomType: true,
        price: true,
        capacity: true,
        available: true,
        amenities: true,
        photos: true,
        hostel: {
          select: {
            id: true,
            name: true,
            address: true,
            locationLat: true,
            locationLng: true,
            contactNumber: true,
            amenities: true,
          },
        },
        favorites: true,
      },
    });

    if (rooms.length === 0) {
      return res.status(404).json({ error: "No rooms found for this hostel" });
    }

    res.status(200).json({
      message: "Rooms fetched successfully",
      rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms by hostel:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

// GET /rooms/:id - Get a single room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      select: {
        id: true,
        hostelId: true,
        roomType: true,
        price: true,
        capacity: true,
        available: true,
        amenities: true,

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

    const hostel = await prisma.hostel.findUnique({ where: { id: hostelId } });
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    const room = await prisma.room.create({
      data: { hostelId, roomType, price, capacity, available, amenities },
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
};

// PUT /rooms/:id - Update a room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existingRoom = await prisma.room.findUnique({ where: { id } });
    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (!validateUpdateRoomData(data)) {
      return res.status(400).json({ error: "Invalid fields in update" });
    }

    if (data.hostelId && data.hostelId !== existingRoom.hostelId) {
      const hostel = await prisma.hostel.findUnique({ where: { id: data.hostelId } });
      if (!hostel) {
        return res.status(404).json({ error: "Target hostel not found" });
      }
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data,
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

// DELETE /rooms/:id - Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    await prisma.room.delete({ where: { id } });

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
};
