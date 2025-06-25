export const validateRoomData = (data) => {
  const { hostelId, roomType, price, capacity } = data;
  return (
    hostelId &&
    roomType &&
    price !== undefined &&
    !isNaN(price) &&
    capacity !== undefined &&
    !isNaN(capacity)
  );
};

export const validateUpdateRoomData = (data) => {
  const { hostelId, roomType, price, capacity } = data;

  if (
    (hostelId !== undefined && !hostelId) ||
    (roomType !== undefined && !roomType) ||
    (price !== undefined && (isNaN(price) || price === null)) ||
    (capacity !== undefined && (isNaN(capacity) || capacity === null))
  ) {
    return false;
  }

  return true;
};


export const validateBookingData = (req, res, next) => {
  if (!req.body || typeof req.body !== "object") {
    console.error("Missing or malformed request body");
    return res.status(400).json({ error: "Missing or invalid request body" });
  }

  const { roomId, studentId, checkInDate, checkOutDate, status } = req.body;
  const method = req.method.toUpperCase();

  if (method === "POST") {
    // For creation, all required fields must be present and valid
    if (
      !roomId ||
      !studentId ||
      !checkInDate ||
      !checkOutDate ||
      !status ||
      isNaN(Date.parse(checkInDate)) ||
      isNaN(Date.parse(checkOutDate))
    ) {
      console.error("Invalid booking data:", req.body);
      return res.status(400).json({ error: "Invalid booking data" });
    }
  } else if (method === "PUT" || method === "PATCH") {
    // For update, validate fields only if they exist
    if (roomId !== undefined && typeof roomId !== "string") {
      return res.status(400).json({ error: "Invalid roomId" });
    }
    if (studentId !== undefined && typeof studentId !== "string") {
      return res.status(400).json({ error: "Invalid studentId" });
    }
    if (checkInDate !== undefined && isNaN(Date.parse(checkInDate))) {
      return res.status(400).json({ error: "Invalid checkInDate" });
    }
    if (checkOutDate !== undefined && isNaN(Date.parse(checkOutDate))) {
      return res.status(400).json({ error: "Invalid checkOutDate" });
    }
    if (status !== undefined) {
      const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
    }
  }

  next();
};
