// types/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  // Optionally:
  favorites?: string[]; // Array of favorite item IDs or update with a specific type later
  inquiries?: string[];
}



export type Role = 'student' | 'owner' | 'admin';
