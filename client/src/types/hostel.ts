import type { User } from './user';
import type { Photo } from './photo';
import type { Room } from './room';
import type { Favorite } from './favorite';
import type { Inquiry } from './inquiry';

export interface Hostel {
    id: string;
    name: string;
    gender: string;
    description: string;
    address: string;
    locationLat: number;
    locationLng: number;
    contactNumber: string;
    amenities: string[];
    status: HostelStatus;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner?: User;
    photos: Photo[];
    rooms: Room[];
    favorites: Favorite[];
    inquiries: Inquiry[];
}
export type HostelStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
