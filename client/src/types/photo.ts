export interface Photo {
    id: string;
    url: string;
    isPrimary: boolean;
    hostelId?: string;
    roomId?: string;
    userId?: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
