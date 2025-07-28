import axios, { AxiosError } from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://student-hostel-app.onrender.com/api";


export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: 'application/json',
    },
});

// Global error interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Token expired or unauthorized - logout user
                // Clear localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // You might also want to reset auth context here if possible

                // Redirect to login page
                window.location.href = '/login';
            }

            console.error('API Error:', error.response.data);
            return Promise.reject(error.response.data);
        }

        if (error.request) {
            console.error('API Error: No response received', error.request);
            return Promise.reject({
                message: 'No response received from server',
                status: 'error',
                success: false,
            });
        }

        console.error('API Error:', error.message);
        return Promise.reject({
            message: error.message,
            status: 'error',
            success: false,
        });
    }
);
