import { api } from './api';
import type { Booking, BookingStatus } from '../types/booking';

export type CreateBookingInput = {
  studentId: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  status?: BookingStatus;
};


function parseArrayResponse<T>(data: unknown, key: string): T[] {
    if (typeof data !== 'object' || data === null || !(key in data)) {
        throw new Error(`Invalid response: missing key "${key}"`);
    }
    const value = (data as Record<string, unknown>)[key];
    if (!Array.isArray(value)) {
        throw new Error(`Invalid response: "${key}" is not an array`);
    }
    return value as T[];
}




/**
 * Creates a new booking.
 * @param {CreateBookingInput} bookingData - The data for the new booking.
 * @returns {Promise<Booking>} A promise that resolves to the created Booking object.
 * 
 * */
export const createBooking = async (bookingData: CreateBookingInput): Promise<Booking> => {
    try {
        const response = await api.post('/bookings', bookingData);
        return response.data.booking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
}

/**
 * Fetches the list of bookings from the API.
 * @returns {Promise<Booking[]>} A promise that resolves to an array of Booking objects.
 */
export const getBookings = async (): Promise<Booking[]> => {
    try {
        const response = await api.get('/bookings');
        return parseArrayResponse<Booking>(response.data, 'bookings');


    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
};

/**
 * Fetches a booking by ID from the API.
 * @param {string} bookingId - The ID of the booking to fetch.
 * @returns {Promise<Booking>} A promise that resolves to a Booking object.
 */
export const getBookingById = async (bookingId: string): Promise<Booking> => {
    try {
        const response = await api.get(`/bookings/${bookingId}`);
        return response.data.booking;
    } catch (error) {
        console.error(`Error fetching booking with ID ${bookingId}:`, error);
        throw error;
    }
};




/**
 * Updates a booking by ID with the provided data.
 * @param {string} bookingId - The ID of the booking to update.
 * @param {Partial<CreateBookingInput>} bookingData - The data to update the booking with.
 * @returns {Promise<Booking>} A promise that resolves to the updated Booking object.
 */
export const updateBooking = async (
    bookingId: string,
    bookingData: Partial<CreateBookingInput>
): Promise<Booking> => {
    try {
        const response = await api.put(`/bookings/${bookingId}`, bookingData);
        return response.data.booking;
    } catch (error) {
        console.error(`Error updating booking with ID ${bookingId}:`, error);
        throw error;
    }
}

/**
 * Deletes a booking by ID.
 * @param {string} bookingId - The ID of the booking to delete.
 * @returns {Promise<void>} A promise that resolves when the booking is deleted.
 */
export const deleteBooking = async (bookingId: string): Promise<void> => {
    try {
        await api.delete(`/bookings/${bookingId}`);
    } catch (error) {
        console.error(`Error deleting booking with ID ${bookingId}:`, error);
        throw error;
    }
}

/**
 * Fetches bookings for a specific student by their ID.
 * @param {string} studentId - The ID of the student whose bookings to fetch.
 * @returns {Promise<Booking[]>} A promise that resolves to an array of Booking objects.
 */
export const getBookingsByStudentId = async (studentId: string): Promise<Booking[]> => {
    try {
        const response = await api.get(`/bookings/student/${studentId}`);
        const bookings = response.data.bookings;

        if (!Array.isArray(bookings)) {
            throw new Error('Invalid response format from API');
        }

        return bookings;
    }
    catch (error) {
        console.error(`Error fetching bookings for student with ID ${studentId}:`, error);
        throw error;
    }
};

export const getBookingsByRoomId = async (roomId: string): Promise<Booking[]> => {
    try {
        const response = await api.get(`/bookings/room/${roomId}`);
        const bookings = response.data.bookings;

        if (!Array.isArray(bookings)) {
            throw new Error('Invalid response format from API');
        }

        return bookings;
    } catch (error) {
        console.error(`Error fetching bookings for room with ID ${roomId}:`, error);
        throw error;
    }
}