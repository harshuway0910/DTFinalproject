// Base URL for backend API
// In production on Render: uses VITE_API_URL environment variable
// In local development: defaults to http://localhost:5000
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
