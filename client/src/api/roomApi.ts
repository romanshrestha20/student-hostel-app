import { api } from './api';
import type { Room } from '../types/room';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Get all rooms (optionally paginated)
export const getRooms = async (hostelId: string, page = 1, limit = 10): Promise<Room[]> => {
  try {
    const response = await api.get('/rooms', { params: { page, limit, hostelId } });
    return response.data.rooms;
  } catch (error: unknown) {
    console.error('Error fetching rooms:', getErrorMessage(error));
    throw error;
  }
};

// Get rooms by hostel ID
export const getRoomsByHostel = async (hostelId: string): Promise<Room[]> => {
  try {
    const response = await api.get(`/rooms/hostel/${hostelId}`);
    return response.data.rooms;
  } catch (error: unknown) {
    console.error('Error fetching rooms by hostel:', getErrorMessage(error));
    throw error;
  }
};

// Get room by ID
export const getRoomById = async (roomId: string): Promise<Room> => {
  try {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data.room;
  } catch (error: unknown) {
    console.error('Error fetching room by ID:', getErrorMessage(error));
    throw error;
  }
};

// Get rooms filtered by room type
export const getRoomsByType = async (roomType: string): Promise<Room[]> => {
  try {
    const response = await api.get(`/rooms/type`, { params: { roomType } });
    return response.data.rooms;
  } catch (error: unknown) {
    console.error('Error fetching rooms by type:', getErrorMessage(error));
    throw error;
  }
};

// Create a new room
export const createRoom = async (roomData: Omit<Room, 'id'>): Promise<Room> => {
  try {
    const response = await api.post('/rooms', roomData);
    return response.data.room;
  } catch (error: unknown) {
    console.error('Error creating room:', getErrorMessage(error));
    throw error;
  }
};

// Update an existing room
export const updateRoom = async (roomId: string, roomData: Partial<Room>): Promise<Room> => {
  try {
    const response = await api.put(`/rooms/${roomId}`, roomData);
    return response.data.room;
  } catch (error: unknown) {
    console.error('Error updating room:', getErrorMessage(error));
    throw error;
  }
};

// Delete a room
export const deleteRoom = async (roomId: string): Promise<void> => {
  try {
    await api.delete(`/rooms/${roomId}`);
  } catch (error: unknown) {
    console.error('Error deleting room:', getErrorMessage(error));
    throw error;
  }
};
