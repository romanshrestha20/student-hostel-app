import React from "react";
import { useParams } from "react-router-dom";
import type { Room } from "../../types/room";
import { getRooms } from "../../api/roomApi";
import RoomCard from "./RoomCard";
import FilterDropdown from "../../components/common/FilterDropdown";
import SortDropdown from "../../components/common/SortDropdown";

const RoomList: React.FC = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [roomTypeFilter, setRoomTypeFilter] = React.useState<string>("");
  const [sortOption, setSortOption] = React.useState<string>("price-asc");

  React.useEffect(() => {
    if (hostelId) {
      fetchRooms(hostelId);
    }
  }, [hostelId]);

  const fetchRooms = async (hostelId: string) => {
    try {
      const rooms = await getRooms(hostelId);
      setRooms(rooms);
    } catch (error) {
      console.error(
        "Error fetching rooms:",
        error instanceof Error ? error.message : error
      );
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms
    .filter((room) =>
      roomTypeFilter ? room.roomType === roomTypeFilter : true
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "room-type")
        return a.roomType.localeCompare(b.roomType);
      return 0;
    });

  if (!hostelId) return <p>Invalid hostel ID.</p>;

  return (
    <div>
      {loading && <p>Loading rooms...</p>}
      {error && <p className="text-red-600">Error fetching rooms: {error}</p>}
      {!loading && !error && rooms.length === 0 && <p>No rooms found.</p>}
      {!loading && !error && rooms.length > 0 && (
        <>
          <h2 className="mb-4 text-2xl font-bold">Available Rooms</h2>

          <div className="flex flex-col gap-4 mb-4 sm:flex-row">
            <FilterDropdown
              label="Room Type"
              value={roomTypeFilter}
              onChange={setRoomTypeFilter}
              options={[
                { label: "All", value: "" },
                { label: "Single", value: "single" },
                { label: "Double", value: "double" },
              ]}
            />

            <SortDropdown
              label="Sort by"
              value={sortOption}
              onChange={setSortOption}
              options={[
                { label: "Price: Low to High", value: "price-asc" },
                { label: "Price: High to Low", value: "price-desc" },
                { label: "Room Type (A-Z)", value: "room-type" },
              ]}
            />
          </div>

          <p className="mb-6 text-sm text-gray-600">
            Showing {filteredRooms.length} room
            {filteredRooms.length !== 1 ? "s" : ""}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RoomList;
