/**
 * TypeScript type definitions for the Library Occupancy System
 */

/**
 * Response from the GET /api/v1/status endpoint
 */
export interface OccupancyResponse {
    occupied_seats: number;
    empty_seats: number;
    total_seats: number;
}

/**
 * Response from the POST /api/v1/live/start endpoint
 */
export interface LiveAnalysisResponse {
    message: string;
    video_filename: string;
}

/**
 * Response from the POST /api/v1/live/start endpoint
 */
export interface LiveAnalysisResponse {
    message: string;
    video_filename: string;
}

/**
 * API error response structure
 */
export interface ApiError {
    detail: string | Record<string, unknown>;
}
