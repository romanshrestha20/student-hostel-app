import { useState, useEffect } from "react";
import { getFavorites, deleteFavorite, createFavorite } from "../api/favoriteApi";
import { useAuth } from "../context/AuthContext";
import type { Favorite } from "../types/favorite";

export const useFavorite = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const addFavorite = async (hostelId: string) => {
    if (!user) return;
    try {
      const newFav = await createFavorite(user.id, hostelId);
      setFavorites((prev) => [...prev, newFav]);
    } catch (err) {
      console.error("Error adding favorite:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      await deleteFavorite(favoriteId);
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  const isHostelFavorited = (hostelId: string): boolean => {
    return favorites.some((fav) => fav.hostelId === hostelId);
  };

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isHostelFavorited,
  };
};
