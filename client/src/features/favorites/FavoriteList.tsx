import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getFavorites, removeFavorite } from "../../api/favoriteApi";
import type { Favorite } from "../../types/favorite";

const FavoriteList = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getFavorites(user.id);
      setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (!user) return;

    try {
      await removeFavorite(favoriteId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (favorites.length === 0) {
    return <p className="text-gray-500">You have no favorite hostels yet.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
      <ul className="space-y-4">
        {favorites.map((fav) => (
          <li key={fav.id} className="p-4 border rounded shadow-sm">
            <Link to={`/hostels/${fav.hostelId}`} className="block mb-2">
              <h3 className="text-xl font-semibold">
                {fav.hostel?.name || "Unnamed Hostel"}
              </h3>
              <p className="text-sm text-gray-600">{fav.hostel?.address}</p>
            </Link>
            <button
              onClick={() => handleRemoveFavorite(fav.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Remove from Favorites
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteList;
