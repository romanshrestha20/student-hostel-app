import React from "react";
import { Link } from "react-router-dom";
import type { Room } from "../../types/room";

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="block p-5 transition-shadow bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg"
    >
      <h3 className="mb-2 text-xl font-semibold text-indigo-700">{room.roomType}</h3>
      <p className="mb-1 text-gray-700">
        <span className="font-semibold">Price:</span> ${room.price}
      </p>
      <p className="mb-1 text-gray-700">
        <span className="font-semibold">Capacity:</span> {room.capacity}{" "}
        {room.capacity > 1 ? "people" : "person"}
      </p>
      <p
        className={`font-semibold mb-2 ${
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
    </Link>
  );
};

export default RoomCard;
