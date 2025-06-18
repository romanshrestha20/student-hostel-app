import React from "react";
import { updateHostel } from "../../api/hostelApi";
import type { Hostel } from "../../types/hostel";

const EditHostelForm = ({
  hostel,
  onSave,
  onCancel,
}: {
  hostel: Hostel;
  onSave: (updated: Hostel) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = React.useState({
    name: hostel.name,
    description: hostel.description,
    address: hostel.address,
    locationLat: hostel.locationLat.toString(),
    locationLng: hostel.locationLng.toString(),
    contactNumber: hostel.contactNumber || "",
    amenities: hostel.amenities.join(", "),
    ownerId: hostel.ownerId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostel.id) {
      alert("Hostel ID is required for updating");
      return;
    }

    const updatedData: Partial<Hostel> = {
      name: formData.name,
      description: formData.description,
      address: formData.address,
      locationLat: parseFloat(formData.locationLat),
      locationLng: parseFloat(formData.locationLng),
      contactNumber: formData.contactNumber,
      amenities: formData.amenities.split(",").map((a) => a.trim()),
      ownerId: formData.ownerId,
    };

    try {
      if (!formData.name.trim()) {
        alert("Name is required");
        return;
      }

      const updatedHostel = await updateHostel(hostel.id, updatedData);
      onSave(updatedHostel);
    } catch (err) {
      console.error("Failed to update hostel:", err);
      alert("Error updating hostel");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "1rem",
        border: "1px solid #ccc",
        padding: "1rem",
      }}
    >
      <h3>Edit Hostel: {hostel.name}</h3>
      <input
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
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <input
        name="locationLat"
        value={formData.locationLat}
        onChange={handleChange}
        placeholder="Latitude"
        required
      />
      <input
        name="locationLng"
        value={formData.locationLng}
        onChange={handleChange}
        placeholder="Longitude"
        required
      />
      <input
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
        placeholder="Contact Number"
      />
      <input
        name="amenities"
        value={formData.amenities}
        onChange={handleChange}
        placeholder="Amenities (comma-separated)"
      />
      <br />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
        Cancel
      </button>
    </form>
  );
};

export default EditHostelForm;
