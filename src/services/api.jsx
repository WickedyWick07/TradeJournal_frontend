import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('Access token:', token);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if it's a 401 error and the original request hasn't been retried yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevents infinite retry loops

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    // If no refresh token is available, redirect to login
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Attempt to refresh the access token
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });

                const { access } = response.data;

                // Update the localStorage with the new access token
                localStorage.setItem('access_token', access);

                // Update the Authorization header for the original request and retry it
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return api(originalRequest); // Retry the original request with new token
            } catch (refreshError) {
                console.log('Error refreshing token', refreshError);

                // If refreshing the token fails, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // If error is not 401 or retry failed, reject the error
        return Promise.reject(error);
    }
);

export default api;
