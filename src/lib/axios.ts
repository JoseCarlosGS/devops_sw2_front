import axios from 'axios';

// Use VITE_API_URL if provided; otherwise fall back to a relative '/api' so
// the dev server can proxy requests to the backend. Trim trailing slashes.
const rawUrl = import.meta.env.VITE_API_URL ?? '';
const baseURL = rawUrl ? rawUrl.replace(/\/+$|\s+$/g, '') : '/api';

const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: { Accept: 'application/json' },
});

// Intercept responses and detect when the server returned HTML (usually
// the Vite index.html) so we can throw a clear error instead of letting
// components receive a string and crash with `.map is not a function`.
api.interceptors.response.use(
    (response) => {
        const data = response?.data;
        if (typeof data === 'string' && data.trim().startsWith('<')) {
            console.error('api: received HTML response from', baseURL + (response.config?.url ?? ''));
            // Throw a helpful message that can be caught by callers
            throw new Error('Invalid API response: received HTML. Check VITE_API_URL or dev proxy configuration.');
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

// para centralizar proyectos tareas etc 


///para centralizar proyectos tareas etc 
