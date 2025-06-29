import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useCreateHostel } from "../../hooks/useCreateHostel";
import { Button, Select, TextArea, TextInput } from "../../components/common";

const CreateHostelForm = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { formData, error, loading, message, handleChange, handleSubmit } =
    useCreateHostel();

  if (authLoading) return <p>Loading...</p>;
  if (!isAuthenticated || user?.role !== "owner")
    return <p>Access denied. Owners only.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-800">
          Create Hostel
        </h2>
        {message && (
          <p className="mb-4 text-center text-green-600">{message}</p>
        )}
        <div className="mb-4">
          
          <TextInput
            label="Hostel Name"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        {/* Label field */}
        <div className="mb-4">
          
          <Select
            label="Hostel Type"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="gender"
            value={formData.gender || ""}
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Co-ed">Co-ed</option>
          </Select>
        </div>
        {/* Contact Number field */}
        <div className="mb-4">
          <TextInput
            label="Contact Number"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="tel"
            name="contactNumber"
            value={formData.contactNumber || ""}
            onChange={handleChange}
            placeholder="Contact Number"
            required
          />
        </div>
        <div className="mb-4">
          <TextArea
            name="description"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
        </div>
        <div className="mb-4">
         
          <TextInput
            label="Address"
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <TextInput
              label="Latitude"
              type="number"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="locationLat"
              value={formData.locationLat}
              onChange={handleChange}
              placeholder="Latitude"
              required
            />
          </div>
          <div className="flex-1">
            <TextInput
              label="Longitude"
              type="number"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="locationLng"
              value={formData.locationLng}
              onChange={handleChange}
              placeholder="Longitude"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <TextInput
            label="Amenities"
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="Amenities (e.g., WiFi, Laundry)"
          />
        </div>
        <Button
          variant="primary"
          id="submit"
          type="submit"
          className="w-full px-4 py-2 mt-2 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Hostel"}
        </Button>
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default CreateHostelForm;
