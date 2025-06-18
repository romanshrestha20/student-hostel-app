// RoomList.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import type { Room } from "../../types/room";
import { getRooms } from "../../api/roomApi";

const RoomList: React.FC = () => {
  const { hostelId } = useParams<{ hostelId: string }>();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

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

  if (!hostelId) return <p>Invalid hostel ID.</p>;

  return (
    <div>
      {loading && <p>Loading rooms...</p>}
      {error && <p>Error fetching rooms: {error}</p>}
      {!loading && !error && rooms.length === 0 && <p>No rooms found.</p>}
      {!loading && !error && rooms.length > 0 && (
        <>
          <h2>Available Rooms</h2>
          <p>Total Rooms: {rooms.length}</p>
          <ul>
            {rooms.map((room) => (
              <li key={room.id}>
                <Link to={`/rooms/${room.id}`}>
                  <strong>{room.roomType}</strong> - ${room.price} - Capacity:{" "}
                  {room.capacity} - {room.available ? "Available" : "Not available"}
                  <br />
                  Amenities: {room.amenities.join(", ")}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default RoomList;
