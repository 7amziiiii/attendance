'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Intern, InternAttendanceLog } from '@/lib/database.types';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AttendanceStatus = 'outside' | 'inside' | 'loading' | null;

export default function InternPage() {
    const router = useRouter();
    const [interns, setInterns] = useState<Intern[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // New state for attendance status detection
    const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>(null);
    const [lastEntryTime, setLastEntryTime] = useState<string | null>(null);
    const [checkingStatus, setCheckingStatus] = useState(false);

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

    // New function: Check attendance status
    const checkAttendanceStatus = async (internId: string) => {
        setCheckingStatus(true);
        setAttendanceStatus('loading');
        setMessage(null);

        try {
            // Get today's start (midnight)
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            // Fetch today's attendance logs for this intern, ordered by time
            const { data, error } = await supabase
                .from('intern_attendance_logs')
                .select('*')
                .eq('intern_id', parseInt(internId))
                .gte('created_at', todayStart.toISOString())
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Determine status based on latest record
            if (!data || data.length === 0) {
                // No attendance today - user is outside
                setAttendanceStatus('outside');
                setLastEntryTime(null);
            } else {
                const latestLog = data[0] as InternAttendanceLog;

                if (latestLog.action === 'entry') {
                    // Last action was entry - user is inside
                    setAttendanceStatus('inside');
                    setLastEntryTime(latestLog.created_at);
                } else {
                    // Last action was exit - user is outside
                    setAttendanceStatus('outside');
                    setLastEntryTime(null);
                }
            }
        } catch (error) {
            console.error('Error checking attendance status:', error);
            setMessage({ type: 'error', text: 'فشل التحقق من حالة الحضور' });
            setAttendanceStatus(null);
        } finally {
            setCheckingStatus(false);
        }
    };

    // Modified: Handle name selection
    const handleNameSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setSelectedId(newId);

        // Reset status when changing selection
        setAttendanceStatus(null);
        setLastEntryTime(null);

        // Check status if a valid ID is selected
        if (newId) {
            checkAttendanceStatus(newId);
        }
    };

    // Modified: Handle attendance with auto-detection
    const handleAttendance = async () => {
        if (!selectedId || !attendanceStatus || attendanceStatus === 'loading') {
            setMessage({ type: 'error', text: 'يرجى اختيار اسمك أولاً' });
            return;
        }

        // Determine action based on current status
        const action: 'entry' | 'exit' = attendanceStatus === 'outside' ? 'entry' : 'exit';

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

    // Helper: Format time for display
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Helper: Get button text and variant based on status
    const getButtonConfig = () => {
        if (attendanceStatus === 'outside') {
            return {
                text: 'تسجيل دخول 🚪',
                variant: 'success' as const
            };
        } else if (attendanceStatus === 'inside') {
            return {
                text: 'تسجيل خروج 👋',
                variant: 'danger' as const
            };
        }
        return {
            text: 'تسجيل الإجراء',
            variant: 'primary' as const
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const buttonConfig = getButtonConfig();

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
                        onChange={handleNameSelection}
                        options={interns.map(int => ({ value: int.id, label: int.name }))}
                        placeholder="اختر اسمك..."
                    />

                    {/* Status Display */}
                    {checkingStatus && (
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">
                                    جاري التحقق من الحالة...
                                </span>
                            </div>
                        </div>
                    )}

                    {attendanceStatus === 'outside' && !checkingStatus && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-center animate-fade-in">
                            <p className="text-red-700 dark:text-red-300 font-bold text-lg">
                                الحالة الحالية: ❌ لم يتم تسجيل دخولك اليوم
                            </p>
                        </div>
                    )}

                    {attendanceStatus === 'inside' && !checkingStatus && lastEntryTime && (
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-center animate-fade-in">
                            <p className="text-green-700 dark:text-green-300 font-bold text-lg">
                                الحالة الحالية: ✅ أنت مسجل دخول منذ {formatTime(lastEntryTime)}
                            </p>
                        </div>
                    )}

                    {/* Single Action Button */}
                    <div className="pt-4">
                        <Button
                            variant={buttonConfig.variant}
                            onClick={handleAttendance}
                            disabled={submitting || !selectedId || checkingStatus || !attendanceStatus || attendanceStatus === 'loading'}
                            className="w-full"
                        >
                            {submitting ? 'جاري التسجيل...' : buttonConfig.text}
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
