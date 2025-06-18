import type { Reply } from './reply';


export interface Inquiry {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    studentId: string;
    hostelId: string;
    replies: Reply[];
}