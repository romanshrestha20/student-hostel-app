import React, { useState, useCallback } from 'react';
import {
    getBookings,
    getBookingsByStudentId,
    getBookingById,
    getBookingsByRoomId,
    createBooking,
    updateBooking,
    deleteBooking,
    type CreateBookingInput,
} from '../api/bookingApi';
import type { Booking } from '../types/booking';
import { useAuth } from "../context/AuthContext";

const useBooking = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const handleError = (err: unknown, defaultMessage: string): Error => {
        const error = err instanceof Error ? err : new Error(defaultMessage);
        setError(error);
        return error;
    };

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const allBookings = await getBookings();
            setBookings(allBookings);
        } catch (err) {
            handleError(err, "Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const createNewBooking = async (bookingData: CreateBookingInput): Promise<Booking | undefined> => {
        if (!user) throw new Error("User not authenticated");
        try {
            const newBooking = await createBooking({
                ...bookingData,
                studentId: user.id,
                startDate: new Date(bookingData.startDate),
                endDate: new Date(bookingData.endDate),
            });
            setBookings((prev) => [...prev, newBooking]);
            return newBooking;
        } catch (err) {
            handleError(err, "Failed to create booking");
        }
    };

    const updateExistingBooking = async (
        bookingId: string,
        bookingData: Partial<Booking>
    ): Promise<Booking | undefined> => {
        try {
            const convertedBookingData = {
                ...bookingData,
                startDate: bookingData.startDate ? new Date(bookingData.startDate) : undefined,
                endDate: bookingData.endDate ? new Date(bookingData.endDate) : undefined,
            };
            const updatedBooking = await updateBooking(bookingId, convertedBookingData);
            setBookings((prev) =>
                prev.map((booking) => (booking.id === bookingId ? updatedBooking : booking))
            );
            return updatedBooking;
        } catch (err) {
            handleError(err, "Failed to update booking");
        }
    };

    const deleteExistingBooking = async (bookingId: string): Promise<void> => {
        try {
            await deleteBooking(bookingId);
            setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
        } catch (err) {
            handleError(err, "Failed to delete booking");
        }
    };
    const fetchBookingById = async (bookingId: string): Promise<Booking | undefined> => {
        if (!bookingId) throw new Error("Booking ID is required");
        try {
            return await getBookingById(bookingId);
        } catch (err) {
            handleError(err, "Failed to fetch booking by ID");
        }
    };

    const getUserBookings = async (): Promise<Booking[] | undefined> => {
        if (!user) throw new Error("User not authenticated");
        try {
            if (user.role !== "student") {
                throw new Error("Only students can fetch their bookings");
            }
            return await getBookingsByStudentId(user.id);
        } catch (err) {
            handleError(err, "Failed to fetch user bookings");
        }
    };

    const getBookingDetails = async (bookingId: string): Promise<Booking | undefined> => {
        try {
            return await getBookingById(bookingId);
        } catch (err) {
            handleError(err, "Failed to fetch booking details");
        }
    };

    const getRoomBookings = async (roomId: string): Promise<Booking[] | undefined> => {
        try {
            if (!roomId) {
                throw new Error("Room ID is required to fetch bookings");
            }
            return await getBookingsByRoomId(roomId);
        } catch (err) {
            handleError(err, "Failed to fetch bookings for room");
        }
    };

    return {
        bookings,
        loading,
        error,
        fetchBookings,
        createNewBooking,
        updateExistingBooking,
        deleteExistingBooking,
        fetchBookingById,
        getUserBookings,
        getRoomBookings,
        getBookingDetails,
    };
};

export default useBooking;
