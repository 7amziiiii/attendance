// Database types based on Supabase schema
export interface Employee {
    id: number;
    created_at: string;
    name: string;
    is_active: boolean;
}

export interface Intern {
    id: number;
    created_at: string;
    name: string;
    is_active: boolean;
}

export interface EmployeeAttendanceLog {
    id: number;
    created_at: string;
    action: 'entry' | 'exit';
    emp_id: number;
}

export interface InternAttendanceLog {
    id: number;
    created_at: string;
    action: 'entry' | 'exit';
    intern_id: number;
}

// Types for joined queries
export interface EmployeeLogWithName extends EmployeeAttendanceLog {
    employee?: {
        name: string;
    };
}

export interface InternLogWithName extends InternAttendanceLog {
    intern?: {
        name: string;
    };
}
