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


/**
 * Fetches the latest status image with seat annotations
 * @returns Promise with the status image blob
 */
export const fetchStatusImage = async (): Promise<Blob> => {
    try {
        const response = await apiClient.get(API_ENDPOINTS.STATUS_IMAGE, {
            responseType: 'blob',
        });

        return response.data;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw new Error(`Status image fetch failed: ${errorMessage}`, { cause: error });
    }
};

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

export const sendLiveFrame = async (frameBlob: Blob): Promise<Blob> => {
    try {
        const formData = new FormData();
        formData.append('frame', frameBlob, 'frame.jpg');

        const response = await apiClient.post(API_ENDPOINTS.LIVE_FRAME, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
        });

        return response.data;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw new Error(`Live camera frame upload failed: ${errorMessage}`, { cause: error });
    }
};

/**
 * Analyzes a single image and returns the image with seat status overlays.
 * @param imageFile - The image file to analyze
 * @returns Promise with the annotated image blob
 */
export const analyzeImage = async (imageFile: File): Promise<Blob> => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await apiClient.post(API_ENDPOINTS.ANALYZE_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
        });

        return response.data;
    } catch (error) {
        const errorMessage = handleApiError(error);
        throw new Error(`Image analysis failed: ${errorMessage}`, { cause: error });
    }
};

export default {
    uploadLiveVideo,
    analyzeImage,
    fetchStatusImage,
};
