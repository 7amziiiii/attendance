'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ExitSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Auto redirect to home after 5 seconds
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
            <div className="max-w-lg w-full space-y-8 bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-2xl text-center animate-fade-in">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="text-8xl animate-bounce">
                        ✅
                    </div>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                        تم تسجيل خروجك بنجاح!
                    </h1>

                    <div className="text-6xl my-6">
                        🙏
                    </div>

                    <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
                        شكراً لجهودك اليوم!
                    </p>

                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        عمل رائع ✨
                    </p>
                </div>

                {/* Back Button */}
                <div className="pt-8 space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        سيتم توجيهك للصفحة الرئيسية تلقائياً خلال 5 ثوانٍ
                    </p>
                    <Link
                        href="/"
                        className="inline-block w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                    >
                        العودة للرئيسية الآن
                    </Link>
                </div>
            </div>
        </main>
    );
}
