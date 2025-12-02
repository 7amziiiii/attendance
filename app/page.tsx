import React from 'react';
import Card from '@/components/Card';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Attendance System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Please select your role to record attendance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card
            title="Employee"
            description="Record your daily entry and exit times"
            href="/employee"
            gradient="from-blue-500 to-cyan-400"
            icon={<span>👨‍💼</span>}
          />
          <Card
            title="Intern"
            description="Track your internship hours"
            href="/intern"
            gradient="from-purple-500 to-pink-500"
            icon={<span>🎓</span>}
          />
        </div>

        <div className="text-center pt-8">
          <a href="/login" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors">
            Admin Login
          </a>
        </div>
      </div>
    </main>
  );
}
