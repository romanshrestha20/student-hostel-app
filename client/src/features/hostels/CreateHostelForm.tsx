import React from "react";
import { createHostel } from "../../api/hostelApi";
import type { CreateHostelInput } from "../../api/hostelApi";
import { useAuth } from "../../context/AuthContext";

const CreateHostelForm = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = React.useState<CreateHostelInput>({
    name: "",
    description: "",
    address: "",
    locationLat: 0,
    locationLng: 0,
    contactNumber: "",
    amenities: [],
    status: "pending",
    ownerId: "", // will be set via useEffect
  });

    React.useEffect(() => {
        if (user) {
        setFormData((prev: CreateHostelInput) => ({
            ...prev,
            ownerId: user.id, // assuming user has an id field
        }));
        }
    }, [user]);

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "locationLat" || name === "locationLng"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    if (!isAuthenticated || user?.role !== "owner") {
      setError("Access denied. Only owners can create hostels.");
      setLoading(false);
      return;
    }
    try {
      await createHostel(formData);
      setMessage("Hostel created successfully!");
      // Optionally reset form or navigate away
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

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
