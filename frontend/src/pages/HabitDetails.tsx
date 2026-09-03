import React, { useState, useEffect } from 'react';
import { habitService } from '../services/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, CheckCircle, Target, Activity } from 'lucide-react';
import Heatmap from '../features/Heatmap';

const HabitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [habit, setHabit] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const habitRes = await habitService.getHabits(); 
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-medium">Loading analysis...</div>;
  if (!habit) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-medium">Habit not found.</div>;

  const completionDates = history.map(h => h.completedAt.split('T')[0]);
  const heatmapData = completionDates.reduce((acc: any, date: string) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => window.history.back()} 
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all duration-200 text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Habit Analysis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" 
              style={{ backgroundColor: habit.category?.color || '#3b82f6' }}
            >
              <CheckCircle className="text-white" size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">{habit.title}</h2>
              <p className="text-slate-400 leading-relaxed">{habit.description || 'No description provided.'}</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={14}/> Frequency</span>
                <span className="text-sm font-medium text-slate-200">{habit.frequency}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2"><TrendingUp size={14}/> Total Completions</span>
                <span className="text-sm font-bold text-emerald-400">{history.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Target className="text-blue-500" size={20} />
              <h3 className="text-lg font-semibold text-slate-100">Consistency Map</h3>
            </div>
            <Heatmap data={heatmapData} />
            <p className="text-xs text-slate-500 text-center italic pt-4">
              Visualizing activity density over the last 100 days
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-500" size={20} />
              <h3 className="text-lg font-semibold text-slate-100">Completion History</h3>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="p-12 text-center bg-slate-800/20 rounded-2xl border border-dashed border-slate-800">
                  <p className="text-slate-500 font-medium">No completions recorded yet.</p>
                </div>
              ) : (
                history.map((entry: any, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-800/30 border border-slate-800/50 hover:border-slate-700 transition-all duration-200 group">
                    <span className="text-sm text-slate-300 font-medium group-hover:text-slate-100 transition-colors">
                      {new Date(entry.completedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Success
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
