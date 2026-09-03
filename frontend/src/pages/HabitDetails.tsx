import React from 'react';

const HabitDetails = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Habit Details</h1>
      <div className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800">
        <p className="text-slate-400">Select a habit to view detailed statistics and history.</p>
      </div>
    </div>
  );
};

export default HabitDetails;
