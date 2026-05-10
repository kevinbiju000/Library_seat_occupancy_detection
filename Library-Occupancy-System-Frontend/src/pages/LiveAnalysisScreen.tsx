/**
 * Live Analysis Screen - Ultra-Minimalist Edition
 * Features: Fixed image flickering, color-coded status grid, bottom upload button.
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchOccupancyStatus, fetchStatusImage } from '../services/statusService';
import { uploadLiveVideo } from '../services/liveService';
import type { OccupancyResponse } from '../types/index';

const POLLING_INTERVAL = 200;

export const LiveAnalysisScreen: React.FC = () => {
    const [occupancyData, setOccupancyData] = useState<OccupancyResponse | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isFetchingRef = useRef(false);

    const fetchStatus = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            const [data, imgBlob] = await Promise.all([
                fetchOccupancyStatus(),
                fetchStatusImage()
            ]);

            setOccupancyData(data);

            const newUrl = URL.createObjectURL(imgBlob);
            setImageUrl(prevUrl => {
                if (prevUrl) URL.revokeObjectURL(prevUrl);
                return newUrl;
            });
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            isFetchingRef.current = false;
        }
    }, []);

    useEffect(() => {
        void fetchStatus();
        const intervalId = setInterval(() => void fetchStatus(), POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, [fetchStatus]);

    useEffect(() => {
        return () => { if (imageUrl) URL.revokeObjectURL(imageUrl); };
    }, [imageUrl]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await uploadLiveVideo(file);
            void fetchStatus();
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex flex-col items-center pt-24 pb-12 px-6 font-sans">

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
            />

            {/* Main Content: Video Left, Stats Right */}
            <div className="w-full max-w-7xl flex-grow flex gap-8 mb-16">
                {/* Video Feed - Left Side */}
                <div className="flex-1 bg-[#1A1A1A] border border-white/10 rounded overflow-hidden flex items-center justify-center relative">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Live Feed"
                            className="w-full h-full object-cover transition-opacity duration-200"
                        />
                    ) : (
                        <span className="text-[10px] tracking-widest text-gray-500 uppercase">
                            No Video Source
                        </span>
                    )}
                </div>

                {/* Stats - Right Side */}
                <div className="w-80 flex flex-col gap-4">
                    {occupancyData ? (
                        <>
                            <div className="bg-[#1A1A1A] border border-red-500 p-6 rounded flex flex-col items-center justify-center">
                                <span className="text-white font-bold text-3xl mb-2">{occupancyData.occupied_seats}</span>
                                <span className="text-[14px] font-black tracking-widest uppercase text-red-500">
                                    Occupied Seats
                                </span>
                            </div>
                            <div className="bg-[#1A1A1A] border border-green-500 p-6 rounded flex flex-col items-center justify-center">
                                <span className="text-white font-bold text-3xl mb-2">{occupancyData.empty_seats}</span>
                                <span className="text-[14px] font-black tracking-widest uppercase text-green-500">
                                    Empty Seats
                                </span>
                            </div>
                            <div className="bg-[#1A1A1A] border border-blue-500 p-6 rounded flex flex-col items-center justify-center">
                                <span className="text-white font-bold text-3xl mb-2">{occupancyData.total_seats}</span>
                                <span className="text-[14px] font-black tracking-widest uppercase text-blue-500">
                                    Total Seats
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-600 text-xs tracking-widest uppercase py-10">
                            No data available
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom: Upload Action */}
            <div>
                <button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="bg-[#FF6500] text-black hover:bg-white px-10 py-4 text-xs font-black tracking-[0.3em] uppercase transition-colors shadow-[0_0_20px_rgba(255,101,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'UPLOADING...' : 'UPLOAD ANALYSIS VIDEO'}
                </button>
            </div>

        </div>
    );
};

export default LiveAnalysisScreen;