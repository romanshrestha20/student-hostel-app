
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
        <div className="p-4 booking-list">
            <h2 className="mb-4 text-xl font-bold">Bookings</h2>
            
            {loading && <p>Loading bookings...</p>}
            {error && <p className="text-red-600">Error: {error.message}</p>}
            {userBookings.length === 0 && !loading && <p>No bookings found.</p>}
            
            {userBookings.length > 0 && (
                <table className="w-full border border-collapse border-gray-300 table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">Room Type</th>
                            <th className="px-4 py-2 border">Student</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Start Date</th>
                            <th className="px-4 py-2 border">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userBookings.map((booking: Booking) => (
                            <tr key={booking.id}>
                                <td className="px-4 py-2 border">{booking.room?.roomType || "Unknown Room"}</td>
                                <td className="px-4 py-2 border">{booking.student?.name || "Unknown Student"}</td>
                                <td className="px-4 py-2 capitalize border">{booking.status}</td>
                                <td className="px-4 py-2 border">{new Date(booking.startDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2 border">{new Date(booking.endDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookingList;
