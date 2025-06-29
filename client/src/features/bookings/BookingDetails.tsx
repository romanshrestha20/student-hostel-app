import React from "react";
import useBooking from "../../hooks/useBooking";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import type { Booking } from "../../types/booking";
import EditBookingForm from "./EditBookingForm";
import DeleteBookingButton from "./DeleteBookingButton";

const BookingDetails = () => {
  const { user } = useAuth();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { fetchBookingById,} = useBooking();
  const [isEditing, setIsEditing] = React.useState(false);


  React.useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) throw new Error("Booking ID is required");
        if (!user || !["student", "admin", "owner"].includes(user.role)) {
          throw new Error("User not authenticated");
        }
        setLoading(true);
        const data = await fetchBookingById(bookingId);
        if (!data) throw new Error("Booking not found");
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, user, fetchBookingById]);

  if (loading) return <div>Loading booking details...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!booking) return <div>No booking found.</div>;

  return (
    <div className="booking-details p-4">
      <h2 className="text-xl font-bold mb-4">Booking Details</h2>
      {isEditing ? (
        <EditBookingForm
          booking={booking}
          onUpdate={(updated) => {
            setBooking(updated);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="details space-y-2">
            <p>
              <strong>Room Type:</strong>{" "}
              {booking.room?.roomType || "Unknown Room"}
            </p>
            <p>
              <strong>Student:</strong>{" "}
              {booking.student?.name || "Unknown Student"}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(booking.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
          </div>

          <div className="actions mt-4">
            {(user?.role === "admin" || user?.role === "owner") && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsEditing(true)}
              >
                Edit Booking
              </button>
            )}
            <DeleteBookingButton
              booking={booking}
              onDeleted={() => alert("Booking deleted successfully")}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BookingDetails;
