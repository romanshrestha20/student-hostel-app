// src/components/SearchHostels.jsx
import React, { useState } from "react";
import { searchHostelsByName } from "../../api/hostelApi";
import type { Hostel } from "../../types/hostel";

const SearchHostels: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Hostel[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const hostels = await searchHostelsByName(query);
      setResults(hostels);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while searching for hostels."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for hostels..."
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white mt-2 px-4 py-2 rounded"
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="mt-4 space-y-2">
        {results.map((hostel) => (
          <li key={hostel.id} className="border p-3 rounded shadow">
            <h3 className="text-lg font-semibold">{hostel.name}</h3>
            <p>{hostel.description}</p>
            <p className="text-sm text-gray-600">{hostel.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SearchHostels;