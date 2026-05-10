/**
 * File upload component with drag-and-drop support
 */

import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { Button } from './Button';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    acceptedFormats?: string[];
    maxSizeMB?: number;
    disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    acceptedFormats = ['.mp4', '.avi', '.mov', '.mkv'],
    maxSizeMB = 500,
    disabled = false,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        setError(null);

        // Check file extension
        const fileName = file.name.toLowerCase();
        const isValidFormat = acceptedFormats.some((format) => fileName.endsWith(format));
        if (!isValidFormat) {
            setError(`Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`);
            return false;
        }

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            setError(`File size exceeds ${maxSizeMB}MB limit. Current size: ${fileSizeMB.toFixed(2)}MB`);
            return false;
        }

        return true;
    };

    const handleFileSelect = (file: File) => {
        if (validateFile(file)) {
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        if (!disabled) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (!disabled && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={clsx(
                    'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
                    isDragging ? 'border-[#FF6500] bg-[#FF6500] bg-opacity-10' : 'border-[#1E3E62]',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                {selectedFile ? (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <svg
                                className="h-12 w-12 text-[#FF6500]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-semibold">{selectedFile.name}</p>
                            <p className="text-gray-400 text-sm">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB
                            </p>
                        </div>
                        <Button variant="tertiary" size="sm" onClick={handleClear} disabled={disabled}>
                            Clear
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <svg
                                className="h-12 w-12 text-[#1E3E62]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-semibold">Drag and drop your video here</p>
                            <p className="text-gray-400 text-sm">or click to select a file</p>
                        </div>
                        <p className="text-gray-500 text-xs">
                            Supported formats: {acceptedFormats.join(', ')} (Max {maxSizeMB}MB)
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={acceptedFormats.join(',')}
                            onChange={handleInputChange}
                            disabled={disabled}
                            className="hidden"
                        />
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled}
                        >
                            Select File
                        </Button>
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
    );
};

export default FileUpload;
