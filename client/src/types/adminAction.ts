// Enums
export type ActionType =
    | 'approve_hostel'
    | 'reject_hostel'
    | 'suspend_hostel'
    | 'verify_user'
    | 'suspend_user'
    | 'delete_content';
    
export type TargetType = 'hostel' | 'user' | 'photo' | 'review';


export interface AdminAction {
    id: string;
    actionType: ActionType;
    targetType: TargetType;
    targetId: string;
    reason?: string;
    createdAt: string;
    adminId?: string;
}
