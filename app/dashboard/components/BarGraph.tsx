import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface BarChartProps {
    name: string;
    count: number;
  }

interface BarGraphProps {
    data: BarChartProps[];
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#DC4E1F" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarGraph;