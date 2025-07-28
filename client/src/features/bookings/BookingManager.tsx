import  { useState, useMemo, useEffect } from "react";
import useBooking from "../../hooks/useBooking";
import type { Booking } from "../../types/booking";

const BookingManager = () => {
  const { bookings, loading, error, fetchBookings } = useBooking();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"startDate" | "endDate">("startDate");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.student?.name?.toLowerCase().includes(query) ||
          b.student?.id?.toLowerCase().includes(query)
      );
    }

    if (roomTypeFilter !== "all") {
      filtered = filtered.filter((b) => b.room?.roomType === roomTypeFilter);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return dateA - dateB;
    });
  }, [bookings, statusFilter, roomTypeFilter, sortBy, searchQuery]);

  const uniqueRoomTypes = Array.from(
    new Set(bookings.map((b) => b.room?.roomType).filter(Boolean))
  );
  const uniqueStatuses = Array.from(new Set(bookings.map((b) => b.status)));

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Manage Bookings</h2>
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name or ID"
          className="w-full px-3 py-2 border rounded shadow-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="all">All Statuses</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={roomTypeFilter}
          onChange={(e) => setRoomTypeFilter(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="all">All Room Types</option>
          {uniqueRoomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "startDate" | "endDate")}
          className="px-2 py-1 border rounded"
        >
          <option value="startDate">Sort by Start Date</option>
          <option value="endDate">Sort by End Date</option>
        </select>
      </div>

      {/* List */}
      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      <ul className="space-y-2">
        {filteredBookings.map((booking: Booking) => (
          <li key={booking.id} className="p-3 border rounded shadow-sm">
            <p>
              <strong>Room:</strong> {booking.room?.roomType || "Unknown"}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
            <p>
              <strong>Start:</strong>{" "}
              {new Date(booking.startDate).toLocaleString()}
            </p>
            <p>
              <strong>End:</strong> {new Date(booking.endDate).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingManager;
