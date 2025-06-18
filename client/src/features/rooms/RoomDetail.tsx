import React from "react";
import type { Room } from "../../types/room";
import { getRooms } from "../../api/roomApi";

const RoomDetail = () => {
  const [room, setRoom] = React.useState<Room | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const fetchRoom = async () => {
        const roomData = await getRooms(); 
        setRoom(roomData[0]); 
      };
      fetchRoom(); 
    } catch (error) {
      console.error("Error fetching room:", error);
      setError("Failed to fetch room details");
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <div>
      {loading && <p>Loading room details...</p>}
      {error && <p>Error fetching room details: {error}</p>}
      {!loading && !error && room && (
        <>
          <h2>Room Details</h2>
          <p>Type: {room.roomType}</p>
          <p>Price: ${room.price}</p>
          <p>Capacity: {room.capacity}</p>
        </>
      )}
    </div>
  );
};

export default RoomDetail;
