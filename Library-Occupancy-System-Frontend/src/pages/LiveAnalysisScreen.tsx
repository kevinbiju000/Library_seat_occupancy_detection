import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchOccupancyStatus } from '../services/statusService';
import { uploadLiveVideo, fetchStatusImage, sendLiveFrame } from '../services/liveService';
import type { OccupancyResponse } from '../types/index';

const POLLING_INTERVAL = 1000;
const CAMERA_CAPTURE_INTERVAL = 500;

export const LiveAnalysisScreen: React.FC = () => {
    const [occupancyData, setOccupancyData] = useState<OccupancyResponse | null>(null);
    const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const captureIntervalRef = useRef<number | null>(null);
    const isFetchingRef = useRef(false);

    const fetchStatus = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            const data = await fetchOccupancyStatus();
            setOccupancyData(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            isFetchingRef.current = false;
        }
    }, []);

    useEffect(() => {
        void fetchStatus();
        const intervalId = window.setInterval(() => void fetchStatus(), POLLING_INTERVAL);
        return () => window.clearInterval(intervalId);
    }, [fetchStatus]);

    useEffect(() => {
        return () => {
            if (annotatedImageUrl) URL.revokeObjectURL(annotatedImageUrl);
        };
    }, [annotatedImageUrl]);

    const stopCamera = useCallback(() => {
        if (videoRef.current?.srcObject instanceof MediaStream) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        setCameraActive(false);
        setIsProcessing(false);
        if (captureIntervalRef.current) {
            window.clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
        }
    }, []);

    const waitForVideoReady = useCallback(async (video: HTMLVideoElement) => {
        return new Promise<void>((resolve, reject) => {
            let elapsed = 0;
            const intervalId = window.setInterval(() => {
                console.log('Waiting for camera ready:', {
                    readyState: video.readyState,
                    videoWidth: video.videoWidth,
                    videoHeight: video.videoHeight,
                });

                if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
                    window.clearInterval(intervalId);
                    resolve();
                    return;
                }

                elapsed += 100;
                if (elapsed >= 3000) {
                    window.clearInterval(intervalId);
                    reject(new Error('Camera did not become ready in time.'));
                }
            }, 100);
        });
    }, []);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                const video = videoRef.current;
                video.muted = true;
                video.playsInline = true;
                video.srcObject = stream;
                await video.play();
                await waitForVideoReady(video);
            }
            setCameraError(null);
            setCameraActive(true);
            console.log('Camera started successfully');
        } catch (err) {
            console.error('Camera error:', err);
            setCameraError('Unable to access camera. Please allow camera permission and refresh.');
            if (videoRef.current?.srcObject instanceof MediaStream) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [waitForVideoReady]);

    const captureFrameFromVideo = useCallback(async (): Promise<Blob | null> => {
        const video = videoRef.current;
        if (!video) {
            console.log('No video element');
            return null;
        }

        // Check if video is actually visible in DOM
        if (video.offsetWidth === 0 || video.offsetHeight === 0) {
            console.log('Video not visible in DOM:', { offsetWidth: video.offsetWidth, offsetHeight: video.offsetHeight });
            return null;
        }

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.log('Video stream not ready:', { videoWidth: video.videoWidth, videoHeight: video.videoHeight, readyState: video.readyState });
            return null;
        }

        console.log('Video dimensions:', { videoWidth: video.videoWidth, videoHeight: video.videoHeight, offsetWidth: video.offsetWidth, offsetHeight: video.offsetHeight });

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) return null;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9);
        });
    }, []);

    const captureAndSendFrame = useCallback(async () => {
        if (!cameraActive || isProcessing) {
            console.log('Skipping capture:', { cameraActive, isProcessing });
            return;
        }

        console.log('Starting frame capture...');
        const frameBlob = await captureFrameFromVideo();
        if (!frameBlob) {
            console.log('No frame blob captured');
            return;
        }

        setIsProcessing(true);
        try {
            // Convert Blob to File for the live frame API
            const frameFile = new File([frameBlob], 'frame.jpg', { type: 'image/jpeg' });
            console.log('Sending frame file to backend:', { name: frameFile.name, size: frameFile.size, type: frameFile.type });
            const responseBlob = await sendLiveFrame(frameFile);
            console.log('Received response from backend');
            const newUrl = URL.createObjectURL(responseBlob);
            setAnnotatedImageUrl(prevUrl => {
                if (prevUrl) URL.revokeObjectURL(prevUrl);
                return newUrl;
            });
        } catch (err) {
            console.error('Frame send failed:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [cameraActive, captureFrameFromVideo, isProcessing]);

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

            // Poll for the status image continuously to show updated frames
            const pollForImage = async () => {
                try {
                    const imageBlob = await fetchStatusImage();
                    const newUrl = URL.createObjectURL(imageBlob);
                    console.log('Created image URL:', newUrl, 'Blob size:', imageBlob.size);
                    setAnnotatedImageUrl(prevUrl => {
                        if (prevUrl) URL.revokeObjectURL(prevUrl);
                        console.log('Setting annotatedImageUrl to:', newUrl);
                        return newUrl;
                    });
                    console.log('Status image updated successfully');
                    // Continue polling for updated images
                    setTimeout(pollForImage, 500);
                } catch (err) {
                    console.log('Status image not ready yet, retrying...', err);
                    // Image not ready yet, try again in 2 seconds
                    setTimeout(pollForImage, 2000);
                }
            };

            // Start polling after a short delay to allow processing to begin
            setTimeout(pollForImage, 1000);

        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (!cameraActive) {
            console.log('Camera not active, not starting interval');
            return;
        }

        console.log('Setting up capture interval');
        const intervalId = window.setInterval(() => {
            void captureAndSendFrame();
        }, CAMERA_CAPTURE_INTERVAL);

        captureIntervalRef.current = intervalId;
        return () => {
            console.log('Clearing capture interval');
            window.clearInterval(intervalId);
        };
    }, [cameraActive, captureAndSendFrame]);

    return (
        <div className="min-h-screen bg-[#212121] flex flex-col items-center pt-24 pb-12 px-6 font-sans">

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
            />

            <div className="w-full max-w-7xl flex-grow flex gap-8 mb-16">
                <div className="flex-1 border border-white/10 rounded overflow-hidden flex items-center justify-center relative bg-black min-h-[400px]">

                    {/* 1. ALWAYS render the video so the ref is available and the stream never breaks */}
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover absolute inset-0"
                        style={{ opacity: cameraActive ? 1 : 0 }}
                        autoPlay
                        muted
                        playsInline
                    />

                    {/* 2. Overlay the annotated frame ON TOP of the hidden/playing video */}
                    {annotatedImageUrl && (
                        <img
                            src={annotatedImageUrl}
                            alt="Live camera analysis"
                            className="w-full h-full object-cover absolute inset-0 z-10"
                            onError={(e) => console.error('Image failed to load:', e)}
                        />
                    )}

                    {/* 3. Overlay the "Camera is off" text when entirely inactive */}
                    {!cameraActive && !annotatedImageUrl && (
                        <div className="w-full h-full flex items-center justify-center text-[10px] tracking-widest text-gray-500 uppercase absolute inset-0 z-20 bg-black">
                            Camera is off
                        </div>
                    )}
                </div>

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

            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            if (cameraActive) {
                                stopCamera();
                            } else {
                                void startCamera();
                            }
                        }}
                        className="bg-[#FF6500] text-black hover:bg-white px-8 py-4 text-xs font-black tracking-[0.3em] uppercase transition-colors shadow-[0_0_20px_rgba(255,101,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cameraActive ? 'STOP CAMERA' : 'START CAMERA'}
                    </button>
                    <button
                        onClick={handleUploadClick}
                        disabled={isUploading || cameraActive}
                        style={{ color: 'white' }}
                        className="bg-[#1A1A1A] border border-white/20 hover:bg-white/10 px-8 py-4 text-xs tracking-[0.3em] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? 'UPLOADING...' : 'UPLOAD VIDEO'}
                    </button>
                </div>
                {cameraError ? (
                    <div className="text-red-500 text-xs tracking-widest uppercase">{cameraError}</div>
                ) : null}
                {isProcessing ? (
                    <div className="text-white text-xs tracking-widest uppercase">Processing live frame...</div>
                ) : null}
                {cameraActive ? (
                    <div className="text-gray-400 text-xs tracking-widest uppercase">Live camera analysis active</div>
                ) : null}
            </div>
        </div>
    );
};

export default LiveAnalysisScreen;
