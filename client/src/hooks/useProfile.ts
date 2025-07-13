import React from 'react';
import type { User } from '../types/user';
import { useAuth } from '../context/useAuth';

import { getUserById, updateUser } from '../api/userApi';

const useProfile = () => {
    const { user } = useAuth();
    const userId = user?.id;

    const [profile, setProfile] = React.useState(user || null);
    const [loading, setLoading] = React.useState(!user);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);


    React.useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await getUserById(userId);
                console.log('fetched updated date:', response.updatedAt);
                setProfile(response);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleEditProfile = async (userId: string, data: Partial<User>) => {
        try {
            // Call API to edit profile
            const response = await updateUser(userId, data);
            setProfile(response);
            setMessage('Profile updated successfully');
        } catch (err) {
            setError('Failed to edit profile');
            console.error('Error updating profile:', err);
        }
    }
    return { profile, loading, error, message, handleEditProfile };
};

export default useProfile;
