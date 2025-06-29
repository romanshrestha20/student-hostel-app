import React from "react";
import { useParams } from "react-router-dom";
import type { Room } from "../../types/room";
import { getRooms } from "../../api/roomApi";
import RoomCard from "./RoomCard";

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
      {error && <p className="text-red-600">Error fetching rooms: {error}</p>}
      {!loading && !error && rooms.length === 0 && <p>No rooms found.</p>}
      {!loading && !error && rooms.length > 0 && (
        <>
          <h2 className="mb-4 text-2xl font-bold">Available Rooms</h2>
          <p className="mb-6">Total Rooms: {rooms.length}</p>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RoomList;
