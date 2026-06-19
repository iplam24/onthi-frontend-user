// Shared runtime configuration for the user front-end.
// Derive values from Vite env vars so .env switches remain the source of truth.

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/+$/, '');
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const APP_NAME = 'HOC24H.TECH';
export const DEFAULT_FALLBACK_AVATAR = '/logo.png';

export function getApiBaseUrl(): string {
    return API_BASE_URL;
}

export function getBackendOrigin(): string {
    return BACKEND_ORIGIN;
}
