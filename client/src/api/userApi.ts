import { api } from './api';
import type { User } from '../types/user';


/**
 * Fetches the list of users from the API.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/users');
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response format from API');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

/**
 * Fetches a user by ID from the API.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<User>} A promise that resolves to a User object.
 */
export const getUserById = async (userId: string): Promise<User> => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data.user;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
    }
};

/**
 * Updates a user by ID with the provided data.
 * @param {string} userId - The ID of the user to update.
 * @param {Partial<User>} userData - The data to update the user with.
 * @returns {Promise<User>} A promise that resolves to the updated User object.
 */
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data.user;
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error;
    }
}

/**
 * Deletes a user by ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<void>} A promise that resolves when the user is deleted.
 */
export const deleteUser = async (userId: string): Promise<void> => {
    try {
        await api.delete(`/users/${userId}`);
        console.log(`User with ID ${userId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
};


/**
 * Uploads a user avatar image.
 * @param {FormData} formData - The FormData object containing the avatar file.
 * @returns {Promise<string>} A promise that resolves to the URL of the uploaded avatar.
 */
export const uploadUserAvatar = async (userId: string, selectedFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const response = await api.post(`/users/${userId}/avatar/user`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    // The avatar URL relative path is here:
    const avatarRelativePath = response.data?.user?.avatar;

    // Prepend your backend URL if needed:
    const backendBaseUrl = "http://localhost:4000";

    return avatarRelativePath.startsWith("/uploads")
        ? backendBaseUrl + avatarRelativePath
        : avatarRelativePath;
};
