import React from 'react'
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Hostel } from "../../types/hostel";
import { Button } from "../../components/common";

interface HostelCardProps {
  hostel: Hostel;
  onEdit?: (hostel: Hostel) => void;
  onDelete?: (hostelId: string) => void;
}

const HostelCard: React.FC<HostelCardProps> = ({
  hostel,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  return (
    <div
      key={hostel.id}
      className="p-5 transition-all shadow bg-gray-50 rounded-xl hover:shadow-lg"
    >
      <div className="flex-1">
        <Link
          to={`/hostels/${hostel.id}`}
          className="text-xl font-semibold text-blue-600 hover:underline"
        >
          {hostel.name}
        </Link>
        {user?.role === "admin" && (
          <span className="px-2 py-1 ml-2 text-xs text-gray-600 bg-gray-200 rounded">
            {hostel.status}
          </span>
        )}
        <div className="mt-2 text-sm text-gray-700">{hostel.address}</div>
        <div className="mt-1 text-sm text-gray-600">
          📍 {hostel.address} | {/* 🏷️ {hostel.type} */}
        </div>
      </div>

      {user?.role === "owner" && (
        <div className="flex gap-2 mt-4">
          <Button
            variant="edit"
            onClick={onEdit ? () => onEdit(hostel) : undefined}
            className="px-3 py-1 text-sm"
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={onDelete ? () => onDelete(hostel.id) : undefined}
            className="px-3 py-1 text-sm"
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default HostelCard