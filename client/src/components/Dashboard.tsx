import React from "react";
// import { useAuth } from "../context/AuthContext";
// import Navbar from "./Navbar";
import HostelList from "../features/hostels/HostelList";

const Dashboard = () => {
  // const { user } = useAuth();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [type, setType] = React.useState("");

  return (
    <>
      <div className="max-w-6xl p-6 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Hostel Dashboard
        </h1>

        <div className="grid gap-4 mb-8 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search hostels..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="New York">New York</option>
            <option value="Delhi">Delhi</option>
            <option value="London">London</option>
            {/* Extend as needed */}
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <HostelList searchTerm={searchTerm} location={location} type={type} />
      </div>
    </>
  );
};

export default Dashboard;
