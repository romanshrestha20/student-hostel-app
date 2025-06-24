import React, { useState, useCallback } from "react";
import type { Hostel } from "../types/hostel";
import { getHostels, createHostel, deleteHostel, getHostelById } from "../api/hostelApi";
import { useAuth } from "../context/AuthContext";

export const useHostels = () => {
    const { user } = useAuth();
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const handleError = (err: unknown, defaultMessage: string) => {
        const error = err instanceof Error ? err : new Error(defaultMessage);
        setError(error);
        return error;
    };

    const fetchHostels = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const allHostels = await getHostels();

            let filteredHostels: Hostel[] = [];

            if (user?.role === "admin") {
                filteredHostels = allHostels;
            } else if (user?.role === "owner") {
                filteredHostels = allHostels.filter(hostel => hostel.ownerId === user.id);
            } else if (user?.role === "student") {
                filteredHostels = allHostels.filter(hostel => hostel.status === "approved");
            } else {
                throw new Error("Unauthorized access");
            }
            if (filteredHostels.length === 0) {
                throw new Error("No hostels found ");
            }

            setHostels(filteredHostels);
        } catch (err) {
            handleError(err, "Failed to fetch hostels");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchHostels();
    }, [fetchHostels]);

    const getHostelDetails = useCallback(async (hostelId: string) => {
        setLoading(true);
        setError(null);
        try {
            const hostel = await getHostelById(hostelId);
            if (!hostel) {
                throw new Error("Hostel not found");
            }
            return hostel;
        } catch (err) {
            handleError(err, "Failed to fetch hostel details");
        } finally {
            setLoading(false);
        }
    }, [hostels]);

    const addHostel = async (newHostel: Omit<Hostel, 'id'>) => {
        setLoading(true);
        setError(null);
        try {
            const createdHostel = await createHostel(newHostel);
            setHostels(prev => [...prev, createdHostel]);
        } catch (err) {
            handleError(err, "Failed to create hostel");
        } finally {
            setLoading(false);
        }
    };

    const removeHostel = async (hostelId: string) => {
        if (!window.confirm("Are you sure you want to delete this hostel?")) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await deleteHostel(hostelId);
            setHostels(prev => prev.filter(h => h.id !== hostelId));
        } catch (err) {
            handleError(err, "Failed to delete hostel");
        } finally {
            setLoading(false);
        }
    };


    return {
        hostels,
        loading,
        error,
        fetchHostels,
        addHostel,
        removeHostel,
        getHostelDetails,

    };
};