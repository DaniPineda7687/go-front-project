import React from 'react';

interface TableProps {
    data: Array<{ [key: string]: any }>;
}

const Table: React.FC<TableProps> = ({ data }) => {
    if (data.length === 0) {
        return <p>No data available</p>;
    }

    const headers = Object.keys(data[0]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header} className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-700">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            {headers.map((header) => (
                                <td key={header} className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700">
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;