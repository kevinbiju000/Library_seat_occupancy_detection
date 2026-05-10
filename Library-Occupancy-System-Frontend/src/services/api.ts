/**
 * Axios API client configuration and base setup
 * This service handles all HTTP requests to the backend API
 */

import axios, {
    type AxiosInstance,
    AxiosError,
    type InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api/v1';

/**
 * Create and configure the Axios instance
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor for logging and common setup
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // You can add authorization headers here if needed
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error: AxiosError) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('Response error:', error);

        // Handle specific error cases
        if (error.response?.status === 404) {
            console.error('Resource not found');
        } else if (error.response?.status === 500) {
            console.error('Server error');
        } else if (!error.response) {
            console.error('Network error - backend may be unreachable');
        }

        return Promise.reject(error);
    }
);

export default apiClient;

/**
 * Utility function to handle API errors
 */
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        if (error.response?.data) {
            const data = error.response.data as Record<string, unknown>;
            return data.detail ? String(data.detail) : error.message;
        }
        return error.message || 'An error occurred while communicating with the server';
    }
    return 'An unexpected error occurred';
};
