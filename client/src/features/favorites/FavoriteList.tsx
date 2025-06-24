import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorite } from "../../hooks/useFavorite";

const FavoriteList = () => {
    const { user } = useAuth();
    const {
        favorites,
        loading,
        error,
        removeFavorite,
    } = useFavorite();

    if (loading) return <p>Loading favorites...</p>;
    if (error) return <p className="text-red-500">{error.message}</p>;
    if (favorites.length === 0) {
        return <p className="text-gray-500">You have no favorite hostels yet.</p>;
    }

return (
    <>
        {user?.role === "student" && (
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
                                onClick={() => removeFavorite(fav.id)}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Remove from Favorites
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </>
);
};

export default FavoriteList;
