import React, { useState, useEffect } from 'react';
import { habitService, categoryService, dashboardService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import Heatmap from '../features/Heatmap';
import BarChart from '../features/BarChart';

const HabitCard = ({ habit, onComplete, onDelete }: any) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800 flex items-center justify-between group hover:border-blue-500/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: habit.category?.color || '#3b82f6' }} 
        />
        <div>
          <h4 className="font-semibold text-slate-200">{habit.title}</h4>
          <p className="text-xs text-slate-500">{habit.category?.name} • {habit.frequency}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onComplete(habit.id)}
          className="p-2 rounded-full transition-colors"
        >
          <Circle className="text-slate-600 hover:text-slate-400" size={24} />
        </button>
        <button 
          onClick={() => onDelete(habit.id)}
          className="p-2 rounded-full text-slate-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ totalHabits: 0, completedToday: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', description: '', categoryId: '', frequency: 'DAILY' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsRes, catRes, dashRes] = await Promise.all([
        habitService.getHabits(),
        categoryService.getCategories(),
        dashboardService.getStats()
      ]);
      setHabits(habitsRes.data);
      setCategories(catRes.data);
      setStats(dashRes.data.stats);
      setWeeklyData(dashRes.data.weeklyData);
      setHeatmapData(dashRes.data.heatmapData);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await habitService.createHabit(newHabit);
      setIsModalOpen(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleComplete = async (id: string) => {
    try {
      await habitService.completeHabit(id);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await habitService.deleteHabit(id);
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Flow</h1>
          <p className="text-slate-400">Track your consistency, master your habits.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> Add Habit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold mb-6 text-slate-300">Daily Habits</h3>
          <AnimatePresence>
            {habits.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-dashed border-slate-800 text-slate-500">
                No habits yet. Start by adding one!
              </div>
            ) : (
              habits.map((habit: any) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onComplete={handleComplete} 
                  onDelete={handleDelete} 
                />
              ))
            )}
          </AnimatePresence>
        </div>
        
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50">
                <span className="text-slate-400">Total Habits</span>
                <span className="font-bold">{stats.totalHabits}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50">
                <span className="text-slate-400">Completed Today</span>
                <span className="font-bold">{stats.completedToday}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4">Weekly Activity</h3>
            <BarChart data={weeklyData} />
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800">
            <h3 className="text-lg font-bold mb-4">Yearly Density</h3>
            <Heatmap data={heatmapData} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">New Habit</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Habit Title</label>
                <input 
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
                  value={newHabit.title}
                  onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
                  value={newHabit.categoryId}
                  onChange={e => setNewHabit({...newHabit, categoryId: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
