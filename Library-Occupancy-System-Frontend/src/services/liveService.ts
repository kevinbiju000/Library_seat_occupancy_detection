/**
 * Live analysis service - Handles occupancy monitoring
 */

import apiClient, { handleApiError } from './api';
import type { LiveAnalysisResponse } from '../types/index';
import API_ENDPOINTS from '../constants/endpoints';

/**
 * Uploads a video file to start live occupancy analysis
 * @param file - The video file to upload
 * @returns Promise with the live analysis response
 * @throws Error if the upload fails
 */
export const uploadLiveVideo = async (file: File): Promise<LiveAnalysisResponse> => {
    try {
        const formData = new FormData();
        formData.append('video', file);

        const response = await apiClient.post<LiveAnalysisResponse>(
            API_ENDPOINTS.LIVE_START,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw new Error(`Live analysis upload failed: ${errorMessage}`, { cause: error });
    }
};

export default {
    uploadLiveVideo,
};
