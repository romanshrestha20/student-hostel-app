import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useCreateHostel } from "../../hooks/useCreateHostel";

const CreateHostelForm = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { formData, error, loading, message, handleChange, handleSubmit } =
    useCreateHostel();

  if (authLoading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "owner")
    return <p>Access denied. Owners only.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Hostel</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <input
        type="number"
        name="locationLat"
        value={formData.locationLat}
        onChange={handleChange}
        placeholder="Latitude"
        required
      />
      <input
        type="number"
        name="locationLng"
        value={formData.locationLng}
        onChange={handleChange}
        placeholder="Longitude"
        required
      />
      <input
        type="text"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
        placeholder="Contact Number"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Hostel"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateHostelForm;
