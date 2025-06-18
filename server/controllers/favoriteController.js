import prisma from "../prisma/client.js";


// Get all favorites for a user
export const getAllFavorites = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch favorites with related hostel and room data
    const favorites = await prisma.favorite.findMany({
      where: { studentId },
      include: {
        hostel: {
          select: {
            id: true,
            name: true,
            description: true,
            address: true,
            locationLat: true,
            locationLng: true,
            contactNumber: true,
            amenities: true,
            status: true,
            createdAt: true,
          },
        },
        room: {
          select: {
            id: true,
            roomType: true,
            price: true,
            capacity: true,
            amenities: true,
            available: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Favorites fetched successfully",
      favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

// Add a hostel to favorites
export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hostelId, roomId } = req.body;

    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
    });

    // Validate required fields
    if (!hostelId) {
      return res.status(400).json({ error: "hostelId is required" });
    }

    // Use findFirst to check if the favorite already exists (roomId can be null)
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        studentId: userId,
        hostelId,
        roomId: roomId ?? null,
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ error: "Favorite already exists" });
    }

    // Create new favorite
    const newFavorite = await prisma.favorite.create({
      data: {
        studentId: userId,
        hostelId,
        roomId: roomId ?? null,
      },
    });

    res.status(201).json({
      message: "Favorite added successfully",
      favorite: newFavorite,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

// Remove a hostel from favorites
export const removeFavorite = async (req, res) => {
  try {
    const studentId = req.user.id; // Note: use `studentId` to match schema
    const { id } = req.params; // Use id from URL params

    if (!id) {
      return res.status(400).json({ error: "Favorite ID is required" });
    }

    // Use findFirst to allow nullable roomId and correct fields
    const favorite = await prisma.favorite.findFirst({
      where: {
        id,
        studentId,
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    // Delete by unique ID
    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    res.status(200).json({
      message: "Favorite removed successfully",
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};

