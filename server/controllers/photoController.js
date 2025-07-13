import prisma from "../prisma/client.js";

// Create/upload a new photo linked to user/hostel/room
export const createPhoto = async (req, res) => {
  try {
    const { userId, hostelId, roomId, isPrimary = false } = req.body;
    // The uploaded file info should be available in req.file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!userId && !hostelId && !roomId) {
      return res.status(400).json({ error: "Must provide userId, hostelId or roomId to link photo" });
    }

    // Optional: validate that only one of userId, hostelId, roomId is provided to avoid ambiguity
    const linkCount = [userId, hostelId, roomId].filter(Boolean).length;
    if (linkCount !== 1) {
      return res.status(400).json({ error: "Provide exactly one of userId, hostelId or roomId" });
    }

    // Build photo record data
    const photoData = {
      url: `/uploads/${req.params.model || "other"}/${req.file.filename}`,
      isPrimary,
      userId: userId || null,
      hostelId: hostelId || null,
      roomId: roomId || null,
    };

    // Optionally enforce only one primary photo per entity
    if (isPrimary) {
      // Remove previous primary photo for that entity
      const filter = {};
      if (userId) filter.userId = userId;
      else if (hostelId) filter.hostelId = hostelId;
      else if (roomId) filter.roomId = roomId;

      await prisma.photo.updateMany({
        where: { ...filter, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const photo = await prisma.photo.create({
      data: photoData,
    });

    res.status(201).json({
      message: "Photo uploaded and saved successfully",
      photo,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ error: "Failed to upload photo" });
  }
};

// Get all photos linked to a specific user, hostel, or room
export const getPhotos = async (req, res) => {
  try {
    const { userId, hostelId, roomId } = req.query;

    if (!userId && !hostelId && !roomId) {
      return res.status(400).json({ error: "Provide userId or hostelId or roomId to fetch photos" });
    }

    const filter = {};
    if (userId) filter.userId = userId;
    else if (hostelId) filter.hostelId = hostelId;
    else if (roomId) filter.roomId = roomId;

    const photos = await prisma.photo.findMany({
      where: filter,
      orderBy: { isPrimary: "desc" }, // primary photo first
    });

    res.status(200).json({
      message: "Photos fetched successfully",
      photos,
    });
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
};

// Delete a photo by ID
export const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Optionally, delete the file from disk here (requires fs module and path to file)

    await prisma.photo.delete({ where: { id } });

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ error: "Failed to delete photo" });
  }
};

// Update photo details (e.g., change isPrimary)
export const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPrimary } = req.body;

    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    if (isPrimary !== undefined) {
      if (typeof isPrimary !== "boolean") {
        return res.status(400).json({ error: "isPrimary must be boolean" });
      }

      if (isPrimary) {
        // Remove primary from other photos linked to same entity
        const filter = {};
        if (photo.userId) filter.userId = photo.userId;
        else if (photo.hostelId) filter.hostelId = photo.hostelId;
        else if (photo.roomId) filter.roomId = photo.roomId;

        await prisma.photo.updateMany({
          where: { ...filter, isPrimary: true },
          data: { isPrimary: false },
        });
      }
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id },
      data: { isPrimary },
    });

    res.status(200).json({
      message: "Photo updated successfully",
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error("Error updating photo:", error);
    res.status(500).json({ error: "Failed to update photo" });
  }
};
