import React from "react";
import { Link } from "react-router-dom";
import { getHostels, deleteHostel } from "../../api/hostelApi";
import type { Hostel } from "../../types/hostel";
import EditHostelForm from "./EditHostelForm";

const HostelList = () => {
  const [hostels, setHostels] = React.useState<Hostel[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [editingHostel, setEditingHostel] = React.useState<Hostel | null>(null);

  React.useEffect(() => {
    const fetchHostels = async () => {
      try {
        const data = await getHostels();
        setHostels(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  const handleDeleteHostel = async (hostelId: string) => {
    try {
      await deleteHostel(hostelId);
      setHostels((prev) => prev.filter((h) => h.id !== hostelId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Delete failed"));
    }
  };

  return (
    <div>
      <h2>Hostel List</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {!loading && hostels.length === 0 && <p>No hostels found.</p>}
      {editingHostel ? (
        <EditHostelForm
          hostel={editingHostel}
          onSave={(updatedHostel) => {
            setHostels((prev) =>
              prev.map((h) => (h.id === updatedHostel.id ? updatedHostel : h))
            );
            setEditingHostel(null);
          }}
          onCancel={() => setEditingHostel(null)}
        />
      ) : (
        <ul>
          {hostels.map((hostel) => (
            <li key={hostel.id}>
              <Link
                to={`/hostels/${hostel.id}`}
                className="text-blue-600 hover:underline"
              >
                {hostel.name}
              </Link>
              <em>{hostel.status}</em>
              <div>
                <button onClick={() => handleDeleteHostel(hostel.id)}>
                  Delete
                </button>
                <button onClick={() => setEditingHostel(hostel)}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HostelList;
