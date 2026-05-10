/**
 * Error alert component for displaying error messages
 */

import React from 'react';
import clsx from 'clsx';

interface ErrorAlertProps {
    message: string;
    onDismiss?: () => void;
    className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss, className }) => {
    return (
        <div
            className={clsx(
                'bg-red-900 border border-red-700 rounded-lg p-4 text-red-100 flex items-start justify-between',
                className
            )}
        >
            <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm mt-1">{message}</p>
                </div>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="text-red-400 hover:text-red-300 ml-4 flex-shrink-0"
                >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ErrorAlert;
