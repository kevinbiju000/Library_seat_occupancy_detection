/**
 * API endpoint constants for the Library Occupancy System
 */

const BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
    // Live Analysis
    LIVE_START: `${BASE_URL}/live/start`,
    LIVE_FRAME: `${BASE_URL}/live/frame`,
    ANALYZE_IMAGE: `${BASE_URL}/analyze/image`,
    STATUS_IMAGE: `${BASE_URL}/status/image`,

    // Status
    STATUS: `${BASE_URL}/status`,
} as const;

export default API_ENDPOINTS;
