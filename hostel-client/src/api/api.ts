import axios, { AxiosError } from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
// Global error interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
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
