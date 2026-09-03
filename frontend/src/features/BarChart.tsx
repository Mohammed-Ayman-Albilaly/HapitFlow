import React from 'react';

const BarChart = ({ data }: { data: { date: string, count: number }[] }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="flex items-end gap-2 h-48 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div 
            className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-400" 
            style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? '4px' : '0' }}
          />
          <span className="text-[10px] text-slate-500">{d.date.split('-')[2]}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
