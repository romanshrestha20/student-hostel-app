import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Room } from "../../types/room";
import { getRoomById } from "../../api/roomApi";

const RoomDetail = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        const data = await getRoomById(roomId);
        setRoom(data);
      } catch {
        setError("Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-2xl px-4 mx-auto">
        {loading && <p className="text-center text-gray-500">Loading room details...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && room && (
          <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-indigo-700">Room Details</h2>

            <p className="mb-2 text-gray-800">
              <span className="font-semibold text-gray-900">Type:</span> {room.roomType}
            </p>
            <p className="mb-2 text-gray-800">
              <span className="font-semibold text-gray-900">Price:</span> ${room.price}
            </p>
            <p className="mb-2 text-gray-800">
              <span className="font-semibold text-gray-900">Capacity:</span> {room.capacity}
            </p>

            <p
              className={`mb-2 font-semibold ${
                room.available ? "text-green-600" : "text-red-600"
              }`}
            >
              {room.available ? "Available" : "Not Available"}
            </p>

            {room.amenities?.length ? (
              <p className="text-sm italic text-gray-500">
                Amenities: {room.amenities.join(", ")}
              </p>
            ) : (
              <p className="text-sm italic text-gray-400">No amenities listed</p>
            )}

            <div className="mt-6">
              <Link
                to={`/create-booking/${room.id}`}
                className="inline-block px-5 py-2 text-white transition bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
              >
                Create Booking
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetail;
