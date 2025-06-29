import type { User } from './user';
import type { Room } from './room';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type Booking = {
  id: string;
  studentId: string;
  roomId: string;
  startDate: string; // ISO string
  endDate: string;
  status: BookingStatus;
  createdAt: string;

  // Optional nested references from expanded API response
  student?: User;
  room?: Room;
};
