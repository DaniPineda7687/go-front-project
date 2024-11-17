const StatsSummary = ({ stats }) => {
    return (
      <div className="grid grid-cols-3 gap-4 mt-8 text-center">
        {stats.map(({ label, value }, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700" title={label}>{label}</h3>
            <p className="text-2xl font-bold text-indigo-600">{value}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default StatsSummary;
