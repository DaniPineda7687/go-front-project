import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DoughnutChartProps {
  percentage: number;
  title: string;
  color: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ percentage, title, color }) => {
  const data = [
    { name: 'Attendance', value: percentage },
    { name: 'Not Attendance', value: 100 - percentage },
  ];

  const COLORS = [color, '#e0e0e0'];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            innerRadius="70%"
            outerRadius="90%"
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl font-bold">{percentage}%</p>
      </div>
    </div>
  );
};

export default DoughnutChart;