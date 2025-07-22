import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RoomList from "../rooms/RoomList";
import type { Hostel } from "../../types/hostel";
import { useFavorite } from "../../hooks/useFavorite";
import { useHostels } from "../../hooks/useHostels";
import type { Room } from "../../types/room";
import RoomCreateForm from "../rooms/RoomCreateForm";
import Modal from "../../components/common/Modal";

const HostelDetail = () => {
  const { user } = useAuth();
  const { hostelId } = useParams<{ hostelId: string }>();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);

  const { loading, error, getHostelDetails } = useHostels();

  const {
    favorites,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isHostelFavorited,
  } = useFavorite();

  useEffect(() => {
    const fetchData = async () => {
      if (!hostelId) return;

      const result = await getHostelDetails(hostelId);
      if (result) {
        setHostel(result);
      }

      await fetchFavorites();
    };

    fetchData();
    // eslint-disable-next-line
  }, [hostelId]);

  const handleToggleFavorite = async () => {
    if (!user || !hostelId) return;

    const existingFav = favorites.find(
      (f) => f.hostelId === hostelId && f.studentId === user.id
    );

    if (existingFav) {
      await removeFavorite(existingFav.id);
    } else {
      await addFavorite(hostelId);
    }
  };

  const handleRoomCreated = (newRoom: Room) => {
    if (!hostel) return;
    const updatedRooms = [...(hostel.rooms ?? []), newRoom];
    setHostel({ ...hostel, rooms: updatedRooms });
  };

  if (loading)
    return <p className="mt-8 text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="mt-8 text-center text-red-500">{error.message}</p>;

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      {hostel && (
        <div className="max-w-2xl p-8 mx-auto mt-6 bg-white border border-gray-200 rounded-lg shadow-lg">
          <h2 className="mb-4 text-3xl font-extrabold text-indigo-700">
            {hostel.name}
          </h2>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold text-gray-900">Description:</span>{" "}
            {hostel.description}
          </p>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold text-gray-900">Address:</span>{" "}
            {hostel.address}
          </p>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold text-gray-900">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                hostel.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {hostel.status}
            </span>
          </p>

          <div className="mt-4">
            <span className="font-semibold text-gray-900">Amenities:</span>
            <ul className="mt-1 text-gray-700 list-disc list-inside">
              {hostel.amenities?.map((item, idx) => (
                <li key={idx} className="ml-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {user?.role === "student" && (
            <div className="mt-6">
              <button
                onClick={handleToggleFavorite}
                className={`px-5 py-2 rounded transition font-semibold shadow-sm ${
                  isHostelFavorited(hostelId!)
                    ? "bg-yellow-400 text-white hover:bg-yellow-500"
                    : "bg-gray-200 text-gray-700 hover:bg-yellow-200"
                }`}
              >
                {isHostelFavorited(hostelId!)
                  ? "★ Remove from Favorites"
                  : "☆ Add to Favorites"}
              </button>
            </div>
          )}
          {user?.role === "owner" && (
            <div className="mt-6">
              <h3 className="mb-4 text-xl font-semibold text-indigo-600">
                Create New Room
              </h3>
              <button
                onClick={() => setIsRoomFormOpen(true)}
                className="px-4 py-2 text-white transition bg-indigo-600 rounded shadow-md hover:bg-indigo-700"
              >
                + Add Room
              </button>

              <Modal
                open={isRoomFormOpen}
                onClose={() => setIsRoomFormOpen(false)}
              >
                <RoomCreateForm
                  hostelId={hostelId!}
                  onClose={() => setIsRoomFormOpen(false)}
                  onRoomCreated={(room) => {
                    handleRoomCreated(room);
                    setIsRoomFormOpen(false);
                  }}
                />
              </Modal>
            </div>
          )}
        </div>
      )}

      <div className="max-w-2xl p-8 mx-auto mt-8 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h3 className="mb-4 text-2xl font-bold text-indigo-600">
          Available Rooms
        </h3>
        <RoomList />
      </div>
    </div>
  );
};

export default HostelDetail;
