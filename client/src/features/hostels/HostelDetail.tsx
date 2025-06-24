import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RoomList from "../rooms/RoomList";
import type { Hostel } from "../../types/hostel";
import { useFavorite } from "../../hooks/useFavorite";
import { useHostels } from "../../hooks/useHostels"; // You missed importing this in the second file!

const HostelDetail = () => {
  const { user } = useAuth();
  const { hostelId } = useParams<{ hostelId: string }>();
  const [hostel, setHostel] = useState<Hostel | null>(null); // ✅ Define state

  const {
    loading,
    error,
    getHostelDetails,
  } = useHostels();

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <>
      {hostel && (
        <div className="max-w-2xl mx-auto mt-6 p-4 border rounded shadow">
          <h2 className="text-2xl font-bold mb-2">{hostel.name}</h2>
          <p className="mb-1">
            <strong>Description:</strong> {hostel.description}
          </p>
          <p className="mb-1">
            <strong>Address:</strong> {hostel.address}
          </p>
          <p className="mb-1">
            <strong>Status:</strong> {hostel.status}
          </p>

          <div className="mt-2">
            <strong>Amenities:</strong>
            <ul className="list-disc list-inside">
              {hostel.amenities?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {user && (
            <div className="mt-4">
              <button onClick={handleToggleFavorite}>
                {isHostelFavorited(hostelId!) ? "★ Remove from Favorites" : "☆ Add to Favorites"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="max-w-2xl mx-auto mt-6 p-4 border rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Available Rooms</h3>
        <RoomList />
      </div>
    </>
  );
};

export default HostelDetail;
