/**
 * Reusable Card component for displaying content
 */

import React from 'react';
import clsx from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
    return (
        <div
            className={clsx(
                'bg-[#0B192C] rounded-lg border border-[#1E3E62] p-4 hover:border-[#FF6500] transition-colors duration-200',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
