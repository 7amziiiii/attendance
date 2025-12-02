# Attendance System

A modern, responsive attendance tracking web application built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Role Selection**: Dedicated portals for Employees and Interns.
- **Attendance Recording**: Simple Entry/Exit logging.
- **Admin Dashboard**: Secure area to view and filter attendance logs.
- **Real-time Data**: Powered by Supabase.
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database & Auth)
- **Icons**: Lucide React (via text/emoji for simplicity)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Schema**
   Ensure your Supabase database has the following tables:
   - `employee` (id, name, is_active, created_at)
   - `intern` (id, name, is_active, created_at)
   - `emp_attendance_logs` (id, emp_id, action, created_at)
   - `intern_attendance_logs` (id, intern_id, action, created_at)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000)

## Admin Access

- Navigate to `/login` or click "Admin Login" on the home page.
- Use your Supabase Auth credentials to sign in.
- View logs, filter by name, or filter by entry/exit status.
