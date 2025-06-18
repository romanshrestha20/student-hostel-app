
import type { Hostel } from './hostel';
import type { Photo } from './photo';
import type { Favorite } from './favorite';

export interface Room {
    id: string;
    roomType: RoomType;
    price: number;
    capacity: number;
    available: boolean;
    amenities: string[];
    hostelId: string;
    hostel?: Hostel;
    photos: Photo[];
    favorites: Favorite[];
}

export type RoomType = 'single' | 'double' | 'dormitory' | 'apartment';
