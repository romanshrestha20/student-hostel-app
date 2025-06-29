import React from "react";
import { useAuth } from "../../context/AuthContext";
import type { Booking } from "../../types/booking";
import useBooking from "../../hooks/useBooking";

const BookingList = () => {
    const { bookings, loading, error } = useBooking();
    const { user } = useAuth();

    if (!user) {
        return <p>Please log in to view your bookings.</p>;
    }

    // show only bookings for the logged-in user
    const userBookings = bookings.filter((booking) => booking.studentId === user.id);

    return (
        <div className="booking-list p-4">
            <h2 className="text-xl font-bold mb-4">Bookings</h2>
            
            {loading && <p>Loading bookings...</p>}
            {error && <p className="text-red-600">Error: {error.message}</p>}
            {userBookings.length === 0 && !loading && <p>No bookings found.</p>}
            
            {userBookings.length > 0 && (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Room Type</th>
                            <th className="border px-4 py-2">Student</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Start Date</th>
                            <th className="border px-4 py-2">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userBookings.map((booking: Booking) => (
                            <tr key={booking.id}>
                                <td className="border px-4 py-2">{booking.room?.roomType || "Unknown Room"}</td>
                                <td className="border px-4 py-2">{booking.student?.name || "Unknown Student"}</td>
                                <td className="border px-4 py-2 capitalize">{booking.status}</td>
                                <td className="border px-4 py-2">{new Date(booking.startDate).toLocaleDateString()}</td>
                                <td className="border px-4 py-2">{new Date(booking.endDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookingList;
