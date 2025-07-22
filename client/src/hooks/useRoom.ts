import {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,

} from "../api/roomApi.ts";
import type { RoomCreateInput } from "../api/roomApi.ts";
import { useState, useEffect } from "react";
import type { Room } from "../types/room.ts";
import { useAuth } from "../context/useAuth.ts";




export const useRoom = () => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const handleError = (err: unknown, defaultMessage: string): Error => {
        const error = err instanceof Error ? err : new Error(defaultMessage);
        setError(error);
        return error;
    };

    const fetchRooms = async () => {
        setLoading(true);
        setError(null);
        try {
            const hostelId = rooms[0]?.hostelId;
            if (!hostelId) throw new Error("Hostel ID not found");
            const allRooms = await getRooms(hostelId);
            setRooms(allRooms);
        } catch (err) {
            handleError(err, "Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const createNewRoom = async (roomData: RoomCreateInput): Promise<Room | undefined> => {
        if (!user || user.role !== 'owner') throw new Error("User not authorized");
        try {
            const newRoom = await createRoom(roomData);
            setRooms((prev) => [...prev, newRoom]);
            return newRoom;
        } catch (err) {
            handleError(err, "Failed to create room");
        }
    };

    const updateExistingRoom = async (roomId: string, roomData: Partial<Room>): Promise<Room | undefined> => {
        if (!user || user.role !== 'admin') throw new Error("User not authorized");
        try {
            const updatedRoom = await updateRoom(roomId, roomData);
            setRooms((prev) => prev.map((room) => (room.id === roomId ? updatedRoom : room)));
            return updatedRoom;
        } catch (err) {
            handleError(err, "Failed to update room");
        }
    };

    const deleteExistingRoom = async (roomId: string): Promise<void> => {
        if (!user || user.role !== 'admin') throw new Error("User not authorized");
        try {
            await deleteRoom(roomId);
            setRooms((prev) => prev.filter((room) => room.id !== roomId));
        } catch (err) {
            handleError(err, "Failed to delete room");
        }
    };

    return {
        rooms,
        loading,
        error,
        fetchRooms,
        createNewRoom,
        updateExistingRoom,
        deleteExistingRoom,
        getRoomById,
    };
};