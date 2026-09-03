import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { habitService } from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import Heatmap from '../features/Heatmap';

const HabitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const habitRes = await habitService.getHabits(); // In a real app we'd have a getHabitById
        const h = habitRes.data.find((item: any) => item.id === id);
        if (h) setHabit(h);
        
        const historyRes = await habitService.getHistory(id!);
        setHistory(historyRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (!habit) return <div className="min-h-screen flex items-center justify-center text-slate-400">Habit not found.</div>;

  const completionDates = history.map(h => h.completedAt.split('T')[0]);
  const heatmapData = completionDates.reduce((acc: any, date: string) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => window.history.back()} 
          className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Habit Analysis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800">
            <div 
              className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center" 
              style={{ backgroundColor: habit.category?.color || '#3b82f6' }}
            >
              <CheckCircle className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{habit.title}</h2>
            <p className="text-slate-400 mb-6">{habit.description || 'No description provided.'}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-xl bg-slate-800/50">
                <span className="text-slate-500 flex items-center gap-2"><Calendar size={16}/> Frequency</span>
                <span className="font-semibold">{habit.frequency}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-800/50">
                <span className="text-slate-500 flex items-center gap-2"><TrendingUp size={16}/> Total Completions</span>
                <span className="font-semibold">{history.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800">
            <h3 className="text-xl font-bold mb-6">Consistency Map</h3>
            <Heatmap data={heatmapData} />
            <p className="text-sm text-slate-500 mt-6 text-center italic">
              Visualizing activity density over the last 100 days
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800">
            <h3 className="text-xl font-bold mb-6">Completion History</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {history.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No completions recorded yet.</p>
              ) : (
                history.map((entry: any, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50">
                    <span className="text-slate-300 font-medium">
                      {new Date(entry.completedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Completed
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;
