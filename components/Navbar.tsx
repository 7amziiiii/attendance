import React from 'react';
import Link from 'next/link';
import Button from './Button';

interface NavbarProps {
    onLogout?: () => void;
    userEmail?: string;
}

export default function Navbar({ onLogout, userEmail }: NavbarProps) {
    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/admin" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            لوحة تحكم الحضور
                        </Link>
                    </div>

                    <div className="flex items-center space-x-reverse space-x-4">
                        {userEmail && (
                            <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                                {userEmail}
                            </span>
                        )}
                        {onLogout && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onLogout}
                                className="!rounded-lg"
                            >
                                تسجيل الخروج
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
