/**
 * Status service - Fetches current occupancy status of all seats
 */

import apiClient, { handleApiError } from './api';
import type { OccupancyResponse } from '../types/index';
import API_ENDPOINTS from '../constants/endpoints';

/**
 * Fetches the current occupancy status of all discovered seats
 * This is the primary endpoint for powering the real-time dashboard
 * @returns Promise with the occupancy response containing all seat statuses and counts
 * @throws Error if the fetch fails
 */
export const fetchOccupancyStatus = async (): Promise<OccupancyResponse> => {
    try {
        const response = await apiClient.get<OccupancyResponse>(API_ENDPOINTS.STATUS);
        return response.data;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw new Error(`Failed to fetch occupancy status: ${errorMessage}`, { cause: error });
    }
};

/**
 * Fetches the latest processed frame with seat statuses overlaid
 * Only available when live analysis is running
 * @returns Promise with the image blob
 * @throws Error if the fetch fails
 */
export const fetchStatusImage = async (): Promise<Blob> => {
    try {
        const response = await apiClient.get(API_ENDPOINTS.STATUS_IMAGE, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw new Error(`Failed to fetch status image: ${errorMessage}`, { cause: error });
    }
};

export default {
    fetchOccupancyStatus,
    fetchStatusImage,
};
