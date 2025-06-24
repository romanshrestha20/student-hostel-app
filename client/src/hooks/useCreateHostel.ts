import { useState } from "react";
import { createHostel } from "../api/hostelApi";
// Update the path below if your hostelApi file is in a different location
import type { CreateHostelInput } from "../api/hostelApi";
import { useAuth } from "../context/AuthContext";

export const useCreateHostel = () => {
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState<CreateHostelInput>({
        name: "",
        description: "",
        address: "",
        locationLat: 0,
        locationLng: 0,
        contactNumber: "",
        amenities: [],
        status: "pending",
        ownerId: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

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
            await createHostel({
                ...formData,
                ownerId: user.id, // Ensure ownerId is always set to current user
            });
            setMessage("Hostel created successfully!");
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

    return {
        formData,
        error,
        loading,
        message,
        handleChange,
        handleSubmit,
    };
};