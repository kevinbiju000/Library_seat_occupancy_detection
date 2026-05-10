/**
 * Summary Card component - displays occupancy statistics
 */

import React from 'react';
import { Card } from '../components';

interface SummaryCardProps {
    label: string;
    count: number;
    color: 'occupied' | 'available' | 'away';
}

const colorMap = {
    occupied: {
        bg: 'bg-red-900 bg-opacity-20',
        border: 'border-red-600',
        text: 'text-red-400',
        number: 'text-red-400',
    },
    available: {
        bg: 'bg-green-900 bg-opacity-20',
        border: 'border-green-600',
        text: 'text-green-400',
        number: 'text-green-400',
    },
    away: {
        bg: 'bg-yellow-900 bg-opacity-20',
        border: 'border-yellow-600',
        text: 'text-yellow-400',
        number: 'text-yellow-400',
    },
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, count, color }) => {
    const colors = colorMap[color];

    return (
        <Card className={`${colors.bg} border-2 ${colors.border}`}>
            <div className="text-center">
                <p className={`text-sm font-semibold ${colors.text} uppercase tracking-wide`}>{label}</p>
                <p className={`text-4xl font-bold mt-2 ${colors.number}`}>{count}</p>
            </div>
        </Card>
    );
};

export default SummaryCard;
