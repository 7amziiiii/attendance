import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
}

export default function Table<T>({
    data,
    columns,
    keyExtractor,
    emptyMessage = 'No data available'
}: TableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left border-collapse bg-white dark:bg-gray-800">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-6 py-4 text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                            {columns.map((col, index) => (
                                <td
                                    key={index}
                                    className={`px-6 py-4 text-gray-800 dark:text-gray-200 ${col.className || ''}`}
                                >
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
