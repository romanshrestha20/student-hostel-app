import React, { useState } from "react";
import type { Booking } from "../../types/booking";
import useBooking from "../../hooks/useBooking";
import { useParams } from "react-router-dom";
import { TextInput, Button, Select } from "../../components/common";

const BookingForm = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { createNewBooking } = useBooking();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<Booking["status"]>("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // createNewBooking expects dates as Date objects
      await createNewBooking({
        roomId: roomId || "", // Ensure roomId is provided
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        studentId: "", // Actually your hook injects studentId from context, so you may remove this here
      });
      setSuccess(true);
      setStartDate("");
      setEndDate("");
      setStatus("pending");
    } catch (err) {
      setError((err as Error).message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md p-6 m-5 mx-auto bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <TextInput
        label="Start Date"
        placeholder="Select start date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <TextInput
        label="End Date"
        placeholder="Select end date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />

      <Select
        label="Booking Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as Booking["status"])}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </Select>

      <Button type="submit" disabled={loading}>
        {loading ? "Booking..." : "Book Now"}
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p style={{ color: "green" }}>Booking created successfully!</p>
      )}
    </form>
  );
};

export default BookingForm;
