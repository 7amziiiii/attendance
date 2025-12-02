'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Employee } from '@/lib/database.types';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Link from 'next/link';

export default function EmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const { data, error } = await supabase
                .from('employee')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            setEmployees(data || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setMessage({ type: 'error', text: 'Failed to load employees' });
        } finally {
            setLoading(false);
        }
    };

    const handleAttendance = async (action: 'entry' | 'exit') => {
        if (!selectedId) {
            setMessage({ type: 'error', text: 'Please select your name first' });
            return;
        }

        setSubmitting(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('emp_attendance_logs')
                .insert([
                    {
                        emp_id: parseInt(selectedId),
                        action: action
                    }
                ]);

            if (error) throw error;

            const employeeName = employees.find(e => e.id === parseInt(selectedId))?.name;
            setMessage({
                type: 'success',
                text: `${action === 'entry' ? 'Entry' : 'Exit'} recorded successfully for ${employeeName}`
            });

            // Clear selection after success
            setSelectedId('');

            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error recording attendance:', error);
            setMessage({ type: 'error', text: 'Failed to record attendance. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Employee Attendance</h1>
                    <p className="text-gray-500 dark:text-gray-400">Select your name and record your status</p>
                </div>

                <div className="space-y-6">
                    <Select
                        label="Select Name"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        options={employees.map(emp => ({ value: emp.id, label: emp.name }))}
                        placeholder="Choose your name..."
                    />

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            variant="success"
                            onClick={() => handleAttendance('entry')}
                            disabled={submitting || !selectedId}
                        >
                            Entry
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleAttendance('exit')}
                            disabled={submitting || !selectedId}
                        >
                            Exit
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
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
