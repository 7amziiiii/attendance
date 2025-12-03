import React from 'react';
import Link from 'next/link';

interface CardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    href: string;
    gradient?: string;
    className?: string; // optional extra classes for custom sizing/styling
}

export default function Card({
    title,
    description,
    icon,
    href,
    gradient = 'from-blue-500 to-purple-600',
    className
}: CardProps) {
    return (
        <Link href={href}>
            <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${className ? className : ''}`}>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 h-full min-h-[200px] flex flex-col items-center justify-center text-center space-y-4">
                    {icon && (
                        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                            {icon}
                        </div>
                    )}
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
