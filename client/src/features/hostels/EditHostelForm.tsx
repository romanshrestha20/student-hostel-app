import React from "react";
import { updateHostel } from "../../api/hostelApi";
import type { Hostel } from "../../types/hostel";
import { TextInput, TextArea, Button } from "../../components/common";

const EditHostelDialog = ({
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
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.locationLat.trim()) {
      newErrors.locationLat = "Latitude is required";
    } else if (isNaN(Number(formData.locationLat))) {
      newErrors.locationLat = "Latitude must be a number";
    }

    if (!formData.locationLng.trim()) {
      newErrors.locationLng = "Longitude is required";
    } else if (isNaN(Number(formData.locationLng))) {
      newErrors.locationLng = "Longitude must be a number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    if (!validate()) return;

    if (!hostel.id) {
      alert("Hostel ID is required for updating");
      return;
    }

    setSubmitting(true);

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
      const updatedHostel = await updateHostel(hostel.id, updatedData);
      setSuccessMsg("Hostel updated successfully!");
      onSave(updatedHostel);
    } catch (err) {
      console.error("Failed to update hostel:", err);
      setErrors({
        general: "Failed to update hostel. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-xl">
        <h3 className="mb-4 text-xl font-semibold text-indigo-700">
          Edit Hostel: {hostel.name}
        </h3>
        {successMsg && (
          <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">
            {successMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            error={errors.name}
            disabled={submitting}
          />
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            error={errors.description}
            disabled={submitting}
          />
          <TextInput
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            error={errors.address}
            disabled={submitting}
          />
          <div className="flex gap-4">
            <TextInput
              name="locationLat"
              value={formData.locationLat}
              onChange={handleChange}
              placeholder="Latitude"
              required
              error={errors.locationLat}
              disabled={submitting}
              className="flex-1"
            />
            <TextInput
              name="locationLng"
              value={formData.locationLng}
              onChange={handleChange}
              placeholder="Longitude"
              required
              error={errors.locationLng}
              disabled={submitting}
              className="flex-1"
            />
          </div>
          <TextInput
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            disabled={submitting}
          />
          <TextInput
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="Amenities (comma-separated)"
            disabled={submitting}
          />

          {errors.general && (
            <p className="text-sm text-red-500">{errors.general}</p>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} variant="primary">
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHostelDialog;
