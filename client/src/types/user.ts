// types/user.ts

import type { Booking } from "./booking";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  gender: Gender;

  photoUrl?: string; // URL to the user's profile photo

  createdAt: string;
  updatedAt: string;
  // Optionally:
  favorites?: string[]; // Array of favorite item IDs or update with a specific type later
  inquiries?: string[];
  bookings?: Booking[]; // Array of bookings made by the user
}


export type Gender = 'male' | 'female' | 'unisex';
export type Role = 'student' | 'owner' | 'admin';
