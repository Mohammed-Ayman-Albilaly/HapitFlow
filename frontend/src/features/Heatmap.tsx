import React from 'react';

const Heatmap = ({ data }: { data: Record<string, number> }) => {
  const days = Object.keys(data).sort();
  
  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-800';
    if (count === 1) return 'bg-blue-900';
    if (count === 2) return 'bg-blue-700';
    if (count === 3) return 'bg-blue-500';
    return 'bg-blue-300';
  };

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {/* Mocking a grid of 365 days for visualization */}
      {Array.from({ length: 100 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (100 - i));
        const dateStr = date.toISOString().split('T')[0];
        const count = data[dateStr] || 0;
        return (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-sm ${getColor(count)} transition-colors hover:ring-1 ring-white`}
            title={`${dateStr}: ${count} habits`}
          />
        );
      })}
    </div>
  );
};

export default Heatmap;
