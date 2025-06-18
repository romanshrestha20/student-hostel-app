import type { Hostel } from './hostel';
import type { Room } from './room';

export interface Favorite {
  id: string;
  studentId: string;
  hostelId: string;
  roomId?: string | null;
  createdAt: string; // ISO string

  // Optional nested objects (if you include them via Prisma's `include`)
  hostel?: Hostel;
  room?: Room;
}
