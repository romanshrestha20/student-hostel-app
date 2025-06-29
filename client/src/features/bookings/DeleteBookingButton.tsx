import React from "react";
import useBooking from "../../hooks/useBooking";
import type { Booking } from "../../types/booking";

type DeleteBookingButtonProps = {
  booking: Booking;
  onDeleted?: () => void;
};

const DeleteBookingButton: React.FC<DeleteBookingButtonProps> = ({ booking, onDeleted }) => {
  const { deleteExistingBooking } = useBooking();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await deleteExistingBooking(booking.id);
      alert("Booking deleted successfully");
      onDeleted?.();
    } catch {
      alert("Failed to delete booking");
    }
  };

  return (
    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>
      Delete Booking
    </button>
  );
};

export default DeleteBookingButton;
