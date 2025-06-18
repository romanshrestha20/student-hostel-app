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
