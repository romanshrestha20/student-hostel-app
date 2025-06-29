import { api } from './api';
import type { Hostel } from '../types/hostel';


export type CreateHostelInput = Omit<
    Hostel,
    'id' | 'createdAt' | 'updatedAt' | 'photos' | 'rooms' | 'favorites' | 'inquiries' | 'owner' | 'Gender'
>;

/**
 * Creates a new hostel.
 * @param {Hostel} hostelData - The data for the new hostel.
 * @returns {Promise<Hostel>} A promise that resolves to the created Hostel object.
 */
export const createHostel = async (hostelData: CreateHostelInput): Promise<Hostel> => {
    try {
        const response = await api.post('/hostels', hostelData);
        return response.data;
    } catch (error) {
        console.error('Error creating hostel:', error);
        throw error;
    }
};


/**
 * Fetches the list of hostels from the API.
 * @returns {Promise<Hostel[]>} A promise that resolves to an array of Hostel objects.
 */
export const getHostels = async (): Promise<Hostel[]> => {
    try {
        const response = await api.get('/hostels');
        const hostels = response.data.hostels;

        if (!Array.isArray(hostels)) {
            throw new Error('Invalid response format from API');
        }

        return hostels;
    } catch (error) {
        console.error('Error fetching hostels:', error);
        throw error;
    }
}

/**
 * Fetches a hostel by ID from the API.
 * @param {string} hostelId - The ID of the hostel to fetch.
 * @returns {Promise<Hostel>} A promise that resolves to a Hostel object.
 */
export const getHostelById = async (hostelId: string): Promise<Hostel> => {
    try {
        const response = await api.get(`/hostels/${hostelId}`);
        return response.data.hostel;
    } catch (error) {
        console.error(`Error fetching hostel with ID ${hostelId}:`, error);
        throw error;
    }
}

/**
 * Updates a hostel by ID with the provided data.
 * @param {string} hostelId - The ID of the hostel to update.
 * @param {Partial<Hostel>} hostelData - The data to update the hostel with.
 * @returns {Promise<Hostel>} A promise that resolves to the updated Hostel object.
 */
export const updateHostel = async (
    hostelId: string,
    hostelData: Partial<Hostel>
): Promise<Hostel> => {
    try {
        const response = await api.put(`/hostels/${hostelId}`, hostelData);
        return response.data;
    } catch (error) {
        console.error(`Error updating hostel with ID ${hostelId}:`, error);
        throw error;
    }
};


/**
 * Deletes a hostel by ID.
 * @param {string} hostelId - The ID of the hostel to delete.
 * @returns {Promise<void>} A promise that resolves when the hostel is deleted.
 */
export const deleteHostel = async (hostelId: string): Promise<void> => {
    try {
        await api.delete(`/hostels/${hostelId}`);
    } catch (error) {
        console.error(`Error deleting hostel with ID ${hostelId}:`, error);
        throw error;
    }
}

/**
 * Searches for hostels by name.
 * @param {string} query - The search query for hostel names.
 * @returns {Promise<Hostel[]>}
 */
export async function searchHostelsByName(query: string): Promise<Hostel[]> {
  if (!query.trim()) return [];

  const response = await api.get<{ message: string; hostels: Hostel[] }>(
    `/hostels/search`,
    { params: { query } }
  );

  // Axios parses JSON automatically
  return response.data.hostels;
}