import React, { useState } from "react";
import type  { Booking, BookingStatus } from "../../types/booking";
import useBooking from "../../hooks/useBooking";

type EditBookingFormProps = {
  booking: Booking;
  onUpdate: (updatedBooking: Booking) => void;
  onCancel: () => void;
};

const EditBookingForm: React.FC<EditBookingFormProps> = ({ booking, onUpdate, onCancel }) => {
  const { updateExistingBooking } = useBooking();
  const [formData, setFormData] = useState({
    status: booking.status,
    startDate: new Date(booking.startDate).toISOString().slice(0, 10),
    endDate: new Date(booking.endDate).toISOString().slice(0, 10),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updated = await updateExistingBooking(booking.id, {
        status: formData.status as BookingStatus,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      onUpdate(updated!);
    } catch {
      alert("Failed to update booking");
    }
  };

  return (
    <div className="edit-booking-form space-y-3">
      <label className="block">
        Status:
        <select name="status" value={formData.status} onChange={handleChange} className="ml-2 border p-1">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>

      <label className="block">
        Start Date:
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="ml-2 border p-1"
        />
      </label>

      <label className="block">
        End Date:
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="ml-2 border p-1"
        />
      </label>

      <div className="flex space-x-2 mt-3">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
          Save
        </button>
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditBookingForm;
