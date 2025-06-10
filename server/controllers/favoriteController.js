import prisma from "../prisma/client.js";


// Get all favorites for a user
export const getAllFavorites = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from the authenticated request
        const favorites = await prisma.favorite.findMany({
        where: { userId: userId },
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
        },
        });
    
        res.status(200).json({
        message: "Favorites fetched successfully",
        favorites: favorites,
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
}
    
// Add a hostel to favorites
export const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from the authenticated request
        const { hostelId } = req.body; // Hostel ID from the request body
    
        // Check if the favorite already exists
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_hostelId: {
                    userId: userId,
                    hostelId: hostelId,
                },
            },
        });
    
        if (existingFavorite) {
            return res.status(400).json({ error: "Hostel is already in favorites" });
        }
    
        // Create a new favorite
        const newFavorite = await prisma.favorite.create({
            data: {
                userId: userId,
                hostelId: hostelId,
            },
        });
    
        res.status(201).json({
            message: "Hostel added to favorites successfully",
            favorite: newFavorite,
        });
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ error: "Failed to add favorite" });
    }
}

// Remove a hostel from favorites
export const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from the authenticated request
        const { hostelId } = req.body; // Hostel ID from the request body
    
        // Find the favorite to delete
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_hostelId: {
                    userId: userId,
                    hostelId: hostelId,
                },
            },
        });
    
        if (!favorite) {
            return res.status(404).json({ error: "Favorite not found" });
        }
    
        // Delete the favorite
        await prisma.favorite.delete({
            where: {
                id: favorite.id,
            },
        });
    
        res.status(200).json({
            message: "Hostel removed from favorites successfully",
        });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ error: "Failed to remove favorite" });
    }
}

