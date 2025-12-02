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

    const getFilteredData = () => {
        const data = activeTab === 'employee' ? employeeLogs : internLogs;

        return data.filter(item => {
            // Filter by Action
            if (actionFilter !== 'all' && item.action !== actionFilter) return false;

            // Filter by Name
            const name = activeTab === 'employee'
                ? (item as EmployeeLogWithName).employee?.name
                : (item as InternLogWithName).intern?.name;

            if (nameFilter && !name?.toLowerCase().includes(nameFilter.toLowerCase())) return false;

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
            header: 'Time',
            accessor: (item: any) => (
                <span className="text-gray-500 font-mono text-sm">
                    {formatDate(item.created_at)}
                </span>
            )
        },
        {
            header: 'Name',
            accessor: (item: any) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    {activeTab === 'employee'
                        ? item.employee?.name || 'Unknown'
                        : item.intern?.name || 'Unknown'}
                </span>
            )
        },
        {
            header: 'Action',
            accessor: (item: any) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${item.action === 'entry'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {item.action}
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
                        data={getFilteredData()}
                        columns={columns}
                        keyExtractor={(item) => item.id}
                        emptyMessage={`No ${activeTab} logs found matching your filters.`}
                    />
                </div>
            </main>
        </div>
    );
}
