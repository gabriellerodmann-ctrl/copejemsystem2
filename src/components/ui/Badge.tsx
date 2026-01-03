import { cn } from '../../lib/utils';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' | 'secondary';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: 'bg-primary-100 text-primary-900 border-primary-200',
        secondary: 'bg-gray-100 text-gray-800 border-gray-200',
        success: 'bg-green-50 text-green-700 border-green-200',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        outline: 'bg-transparent border-gray-300 text-gray-600',
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
