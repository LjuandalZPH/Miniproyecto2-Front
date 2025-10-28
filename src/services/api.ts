import axios from 'axios';

/**
 * Axios API instance
 *
 * A pre-configured axios instance used across the app for HTTP requests.
 * - `baseURL` is taken from the Vite environment variable `VITE_API_URL` when
 *   available, otherwise it falls back to http://localhost:3000/api. Adjust
 *   this in production or staging as appropriate.
 * - `withCredentials: true` is enabled so that cookies (if the API uses them)
 *   are sent with requests. If your backend does not use cookies for auth,
 *   this can be safely left but may be removed to avoid sending unnecessary
 *   credentials.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // include cookies if backend uses them
});

/**
 * Request interceptor
 *
 * Automatically attaches a Bearer token from localStorage (key: 'token') to
 * the Authorization header for outgoing requests when available. This keeps
 * authentication concerns centralized and avoids repeating header logic.
 *
 * Note: The interceptor mutates the request config.headers object in place
 * when present. If you need to support server-side rendering or different
 * storage strategies, adapt token retrieval accordingly.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Default export: configured axios instance
 *
 * Import this module to perform HTTP requests with the application's base
 * configuration and automatic token handling.
 */
export default api;

