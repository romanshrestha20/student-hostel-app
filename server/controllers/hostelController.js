import prisma from "../prisma/client.js";

// Validation helpers
const isValidString = (value) =>
  typeof value === "string" && value.trim() !== "";
const isValidNumber = (value) => typeof value === "number" && !isNaN(value);

// Validate incoming hostel data
const validateHostelData = (data) => {
  const {
    ownerId,
    name,
    description,
    address,
    locationLat,
    locationLng,
    contactNumber,
  } = data;

  if (!isValidString(ownerId)) return "ownerId";
  if (!isValidString(name)) return "name";
  if (!isValidString(description)) return "description";
  if (!isValidString(address)) return "address";
  if (!isValidNumber(locationLat)) return "locationLat";
  if (!isValidNumber(locationLng)) return "locationLng";
  if (!isValidString(contactNumber)) return "contactNumber";

  return true;
};


// Get all hostels
export const getAllHostels = async (req, res) => {
  try {
    const hostels = await prisma.hostel.findMany({
      select: {
        id: true,
        ownerId: true,
        name: true,
        description: true,
        address: true,
        locationLat: true,
        locationLng: true,
        amenities: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "Hostels fetched successfully",
      hostels,
    });
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ error: "Failed to fetch hostels" });
  }
};

// Get hostel by ID
export const getHostelById = async (req, res) => {
  try {
    const hostelId = req.params.id;

    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
      select: {
        id: true,
        ownerId: true,
        name: true,
        description: true,
        address: true,
        locationLat: true,
        locationLng: true,
        amenities: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    res.status(200).json({
      message: "Hostel fetched successfully",
      hostel,
    });
  } catch (error) {
    console.error("Error fetching hostel:", error);
    res.status(500).json({ error: "Failed to fetch hostel" });
  }
};


// Create Hostel Controller
export const createHostel = async (req, res) => {
  try {
    const {
      ownerId,
      name,
      description,
      address,
      locationLat,
      locationLng,
      contactNumber,
      amenities,
      status,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      ownerId,
      name,
      description,
      address,
      locationLat,
      locationLng,
      contactNumber,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (
        (typeof value === "string" && value.trim() === "") ||
        value === undefined ||
        value === null ||
        (typeof value === "number" && isNaN(value))
      ) {
        return res
          .status(400)
          .json({ error: `Invalid or missing field: ${key}` });
      }
    }

    // Validate that the owner exists and is of role 'owner'
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== "owner") {
      return res
        .status(400)
        .json({ error: "Invalid ownerId or user is not an owner." });
    }
    // Create hostel
    const newHostel = await prisma.hostel.create({
      data: {
        ownerId,
        name,
        description,
        address,
        locationLat,
        locationLng,
        contactNumber,
        amenities: Array.isArray(amenities)
          ? amenities
          : typeof amenities === "string"
          ? amenities.split(",").map((a) => a.trim())
          : [],

        status: status || "pending",
      },
    });

    return res.status(201).json({
      message: "Hostel created successfully",
      hostel: newHostel,
    });
  } catch (error) {
    console.error("Error creating hostel:", error);
    return res.status(500).json({ error: "Failed to create hostel" });
  }
};

export const updateHostel = async (req, res) => {
  try {
    const hostelId = req.params.id;

    // Check if the hostel exists first
    const existingHostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
    });

    if (!existingHostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    const {
      ownerId,
      name,
      description,
      address,
      locationLat,
      locationLng,
      contactNumber,
      amenities,
      status,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      ownerId,
      name,
      description,
      address,
      locationLat,
      locationLng,
      contactNumber,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (
        (typeof value === "string" && value.trim() === "") ||
        value === undefined ||
        value === null ||
        (typeof value === "number" && isNaN(value))
      ) {
        return res
          .status(400)
          .json({ error: `Invalid or missing field: ${key}` });
      }
    }

    // Validate owner
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== "owner") {
      return res
        .status(400)
        .json({ error: "Invalid ownerId or user is not an owner." });
    }

    // Proceed with update
    const updatedHostel = await prisma.hostel.update({
      where: { id: hostelId },
      data: {
        ownerId,
        name,
        description,
        address,
        locationLat,
        locationLng,
        contactNumber,
        amenities: Array.isArray(amenities)
          ? amenities
          : typeof amenities === "string"
          ? amenities.split(",").map((a) => a.trim())
          : [],
        status: status || existingHostel.status, // preserve old status if not updated
      },
    });

    return res.status(200).json({
      message: "Hostel updated successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Error updating hostel:", error);
    return res.status(500).json({ error: "Failed to update hostel" });
  }
};

// Delete hostel by ID
export const deleteHostel = async (req, res) => {
  try {
    const hostelId = req.params.id;

    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
    });

    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    await prisma.hostel.delete({
      where: { id: hostelId },
    });

    res.status(200).json({ message: "Hostel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    res.status(500).json({ error: "Failed to delete hostel" });
  }
};


// Search hostels by name
export const searchHostels = async (req, res) => {
  try {
    const {query} = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }
    const hostels = await prisma.hostel.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        description: true,
        address: true,
        locationLat: true,
        locationLng: true,
        amenities: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (hostels.length === 0) {
      return res.status(404).json({ message: `No hostels found for query: ${query}` });
    }
    res.status(200).json({
      message: "Hostels found",
      hostels,
    }); 
  }
  catch (error) {
    console.error("Error searching hostels:", error);
    res.status(500).json({ error: "Failed to search hostels" });
  }
}