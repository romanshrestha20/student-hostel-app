import React, { useState } from "react";
import { searchHostelsByName } from "../../api/hostelApi";
import type { Hostel } from "../../types/hostel";

const SearchHostels: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Hostel[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const hostels = await searchHostelsByName(query);
      setResults(hostels);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl p-4 mx-auto">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for hostels..."
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="mt-2 text-red-500">{error}</p>}

      <ul className="mt-4 space-y-2">
        {results.map((hostel) => (
          <li
            key={hostel.id}
            className="p-4 bg-white border rounded shadow hover:bg-gray-50"
          >
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
