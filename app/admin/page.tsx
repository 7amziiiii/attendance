'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { EmployeeLogWithName, InternLogWithName } from '@/lib/database.types';

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'employee' | 'intern'>('employee');

    const [employeeLogs, setEmployeeLogs] = useState<EmployeeLogWithName[]>([]);
    const [internLogs, setInternLogs] = useState<InternLogWithName[]>([]);

    // Filters
    const [nameFilter, setNameFilter] = useState('');
    const [actionFilter, setActionFilter] = useState<'all' | 'entry' | 'exit'>('all');

    const router = useRouter();

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (userEmail) {
            fetchLogs();
        }
    }, [userEmail, activeTab]);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/login');
        } else {
            setUserEmail(session.user.email || '');
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            if (activeTab === 'employee') {
                const { data, error } = await supabase
                    .from('emp_attendance_logs')
                    .select('*, employee(name)')
                    .order('created_at', { ascending: false })
                    .limit(200);

                if (error) throw error;
                setEmployeeLogs(data as EmployeeLogWithName[]);
            } else {
                const { data, error } = await supabase
                    .from('intern_attendance_logs')
                    .select('*, intern(name)')
                    .order('created_at', { ascending: false })
                    .limit(200);

                if (error) throw error;
                setInternLogs(data as InternLogWithName[]);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDayKey = (dateString: string) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    };

    const getCombinedData = () => {
        const logs = activeTab === 'employee' ? employeeLogs : internLogs;
        const map = new Map<string, { key: string; name: string; entry?: string; exit?: string }>();

        logs.forEach(log => {
            const name = activeTab === 'employee'
                ? (log as EmployeeLogWithName).employee?.name
                : (log as InternLogWithName).intern?.name;
            if (!name) return;

            const dayKey = getDayKey(log.created_at);
            const key = `${name}-${dayKey}`;
            const existing = map.get(key) || { key, name };

            if (log.action === 'entry') {
                existing.entry = log.created_at;
            } else if (log.action === 'exit') {
                existing.exit = log.created_at;
            }

            map.set(key, existing);
        });

        return Array.from(map.values()).filter(item => {
            if (nameFilter && !item.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
            if (actionFilter === 'entry' && !item.entry) return false;
            if (actionFilter === 'exit' && !item.exit) return false;
            return true;
        });
    };

    if (loading && !userEmail) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const columns = [
        {
            header: 'Name',
            accessor: (item: any) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                </span>
            )
        },
        {
            header: 'Entry',
            accessor: (item: any) => (
                <span className="text-gray-600 dark:text-gray-400">
                    {item.entry ? formatDate(item.entry) : 'No action'}
                </span>
            )
        },
        {
            header: 'Exit',
            accessor: (item: any) => (
                <span className="text-gray-600 dark:text-gray-400">
                    {item.exit ? formatDate(item.exit) : 'No action'}
                </span>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar userEmail={userEmail} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header & Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Logs</h1>

                        <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('employee')}
                                className={`flex-1 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'employee'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Employees
                            </button>
                            <button
                                onClick={() => setActiveTab('intern')}
                                className={`flex-1 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'intern'
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Interns
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value as any)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="all">All Actions</option>
                                <option value="entry">Entry Only</option>
                                <option value="exit">Exit Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <Table
                        data={getCombinedData()}
                        columns={columns}
                        keyExtractor={(item) => item.key || item.name}
                        emptyMessage={`No ${activeTab} logs found matching your filters.`}
                    />
                </div>
            </main>
        </div>
    );
}
