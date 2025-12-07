'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Intern } from '@/lib/database.types';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InternPage() {
    const router = useRouter();
    const [interns, setInterns] = useState<Intern[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchInterns();
    }, []);

    const fetchInterns = async () => {
        try {
            const { data, error } = await supabase
                .from('intern')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            setInterns(data || []);
        } catch (error) {
            console.error('Error fetching interns:', error);
            setMessage({ type: 'error', text: 'فشل تحميل المتدربين' });
        } finally {
            setLoading(false);
        }
    };

    const handleAttendance = async (action: 'entry' | 'exit') => {
        if (!selectedId) {
            setMessage({ type: 'error', text: 'يرجى اختيار اسمك أولاً' });
            return;
        }

        setSubmitting(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('intern_attendance_logs')
                .insert([
                    {
                        intern_id: parseInt(selectedId),
                        action: action
                    }
                ]);

            if (error) throw error;

            // Redirect to success page
            router.push(`/success/${action}`);
        } catch (error) {
            console.error('Error recording attendance:', error);
            setMessage({ type: 'error', text: 'فشل تسجيل الحضور. يرجى المحاولة مرة أخرى.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">حضور المتدربين</h1>
                    <p className="text-gray-500 dark:text-gray-400">اختر اسمك وسجل حالتك</p>
                </div>

                <div className="space-y-6">
                    <Select
                        label="اختر الاسم"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        options={interns.map(int => ({ value: int.id, label: int.name }))}
                        placeholder="اختر اسمك..."
                    />

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            variant="success"
                            onClick={() => handleAttendance('entry')}
                            disabled={submitting || !selectedId}
                        >
                            دخول
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleAttendance('exit')}
                            disabled={submitting || !selectedId}
                        >
                            خروج
                        </Button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-center font-medium animate-fade-in ${message.type === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <div className="text-center pt-4">
                    <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                        → العودة للرئيسية
                    </Link>
                </div>
            </div>
        </main>
    );
}
