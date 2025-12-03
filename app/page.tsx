"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col justify-between items-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="flex justify-center mb-8">
        <Image src="/new-design-logo.png" alt="Attendance logo" width={150} height={150} priority />
      </div>

      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Attendance System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Please select your role to record attendance
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card
              title="Employee"
              description="Daily entry and exit times"
              href="/employee"
              gradient="from-blue-500 to-cyan-400"
            // icon placeholder
            />
            <Card
              title="Intern"
              description="Daily entry and exit times"
              href="/intern"
              gradient="from-purple-500 to-pink-500"
            // icon placeholder
            />
          </div>

          <footer className="w-full text-center py-4">
            <Button onClick={() => router.push('/login')} variant="secondary" size="md" className="text-sm">
              Admin Login
            </Button>
          </footer>
        </div>
      </div>
    </main>
  );
}
