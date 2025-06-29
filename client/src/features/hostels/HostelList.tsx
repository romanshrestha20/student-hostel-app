import React from "react";

import { useHostels } from "../../hooks/useHostels";
import type { Hostel } from "../../types/hostel";
import EditHostelForm from "./EditHostelForm";
import HostelCard from "./HostelCard";

interface HostelListProps {
  searchTerm?: string;
  location?: string;
  type?: string;
}

const HostelList = ({ searchTerm = "", location = "" }: HostelListProps) => {
  const { hostels, loading, error, fetchHostels, removeHostel } = useHostels();
  const [editingHostel, setEditingHostel] = React.useState<Hostel | null>(null);

  const filteredHostels = hostels.filter((hostel) => {
    const matchesSearch = hostel.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation = location ? hostel.address === location : true;
    // const matchesType = type ? hostel.type === type : true;
    return matchesSearch && matchesLocation; // && matchesType;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Hostels</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
      {!loading && filteredHostels.length === 0 && (
        <p className="text-gray-500">No hostels match your filters.</p>
      )}

      {editingHostel ? (
        <EditHostelForm
          hostel={editingHostel}
          onSave={() => {
            fetchHostels();
            setEditingHostel(null);
          }}
          onCancel={() => setEditingHostel(null)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHostels.map((hostel) => (
            <HostelCard
              hostel={hostel}
              onEdit={() => setEditingHostel(hostel)}
              onDelete={() => {
                if (
                  window.confirm("Are you sure you want to delete this hostel?")
                ) {
                  removeHostel(hostel.id);
                } else {
                  console.log("Deletion cancelled");
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HostelList;
