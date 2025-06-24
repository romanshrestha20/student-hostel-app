import { api } from './api';
import type { Favorite } from '../types/favorite';



export const getFavorites = async (userId: string): Promise<Favorite[]> => {
    try {
        const response = await api.get(`/favorites?userId=${userId}`);
        return response.data.favorites;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
}

export const createFavorite = async (userId: string, hostelId: string): Promise<Favorite> => {
    try {
        const response = await api.post('/favorites', { userId, hostelId });
        return response.data.favorite;
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
}

export const deleteFavorite = async (favoriteId: string): Promise<void> => {
    try {
        await api.delete(`/favorites/${favoriteId}`);
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
}