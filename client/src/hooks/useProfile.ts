import React from 'react';
import { useAuth } from '../context/useAuth';
import { getUserById } from '../api/userApi';

const useProfile = () => {
    const { user } = useAuth();
    const userId = user?.id;

    const [profile, setProfile] = React.useState(user || null);
    const [loading, setLoading] = React.useState(!user);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await getUserById(userId);
                setProfile(response);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    return { profile, loading, error };
};

export default useProfile;
