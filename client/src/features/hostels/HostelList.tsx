import React from "react";
import { Link } from "react-router-dom";
import { useHostels } from "../../hooks/useHostels";
import type { Hostel } from "../../types/hostel";
import EditHostelForm from "./EditHostelForm";
import { useAuth } from "../../context/AuthContext";

const HostelList = () => {
  const { user } = useAuth();
  const { hostels, loading, error, fetchHostels, removeHostel } = useHostels();
  const [editingHostel, setEditingHostel] = React.useState<Hostel | null>(null);

  return (
    <div>
      <h2>Hostel List</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {!loading && hostels.length === 0 && <p>No hostels found.</p>}
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
        <ul>
          {hostels.map((hostel) => (
            <li key={hostel.id}>
              <Link
                to={`/hostels/${hostel.id}`}
                className="text-blue-600 hover:underline"
              >
                {hostel.name}
              </Link>
              {user?.role == "admin" && <em>{hostel.status}</em>}
              {user?.role == "owner" && (
                <div>
                  <button onClick={() => removeHostel(hostel.id)}>
                    Delete
                  </button>
                  <button onClick={() => setEditingHostel(hostel)}>Edit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HostelList;
