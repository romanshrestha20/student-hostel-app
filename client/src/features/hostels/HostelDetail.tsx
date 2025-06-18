import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHostelById } from "../../api/hostelApi";
import { addFavorite, getFavorites } from "../../api/favoriteApi";
import { useAuth } from "../../context/AuthContext";
import RoomList from "../rooms/RoomList";
import type { Hostel } from "../../types/hostel";
import type { Favorite } from "../../types/favorite";

const HostelDetail = () => {
  const { user } = useAuth();
  const { hostelId } = useParams<{ hostelId: string }>();

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const fetchHostelDetail = async (id: string) => {
    try {
      setLoading(true);
      const data = await getHostelById(id);
      setHostel(data);
    } catch (err) {
      console.error("Error fetching hostel details:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async (userId: string, hostelId: string) => {
    try {
      const favorites: Favorite[] = await getFavorites(userId);
      const exists = favorites.some(fav => fav.hostelId === hostelId);
      setIsFavorite(exists);
    } catch (err) {
      console.error("Error checking favorites:", err);
    }
  };

  const handleAddFavorite = async () => {
    if (!hostel || !user) return;

    try {
      await addFavorite(user.id, hostel.id); 
      setIsFavorite(true);
    } catch (err) {
      console.error("Error adding to favorites:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  useEffect(() => {
    if (hostelId) {
      fetchHostelDetail(hostelId);
      if (user) checkIfFavorite(user.id, hostelId);
    }
  }, [hostelId, user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <>
      {hostel && (
        <div className="max-w-2xl mx-auto mt-6 p-4 border rounded shadow">
          <h2 className="text-2xl font-bold mb-2">{hostel.name}</h2>
          <p className="mb-1"><strong>Description:</strong> {hostel.description}</p>
          <p className="mb-1"><strong>Address:</strong> {hostel.address}</p>
          <p className="mb-1"><strong>Status:</strong> {hostel.status}</p>

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
              <button
                onClick={handleAddFavorite}
                className={`px-4 py-2 rounded ${
                  isFavorite ? "bg-gray-400" : "bg-blue-600"
                } text-white`}
                disabled={isFavorite}
              >
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
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
