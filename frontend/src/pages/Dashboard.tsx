import React, { useState, useEffect } from 'react';
import { habitService, categoryService, dashboardService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, TrendingUp, Activity, Target } from 'lucide-react';
import Heatmap from '../features/Heatmap';
import BarChart from '../features/BarChart';

const HabitCard = ({ habit, onComplete, onDelete }: any) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-panel p-4 rounded-2xl flex items-center justify-between group transition-all duration-200 hover:border-blue-500/40"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-2 h-10 rounded-full transition-all group-hover:w-3" 
          style={{ backgroundColor: habit.category?.color || '#3b82f6' }} 
        />
        <div>
          <h4 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">{habit.title}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{habit.category?.name}</span>
            <span className="opacity-50">•</span>
            <span>{habit.frequency}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onComplete(habit.id)}
          className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-200"
          title="Mark Complete"
        >
          <Circle size={20} />
        </button>
        <button 
          onClick={() => onDelete(habit.id)}
          className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          title="Delete Habit"
        >
          <Trash2 size={18} />
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
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-100">Dashboard</h1>
          <p className="text-slate-400 font-medium">Welcome back. Let's maintain the flow.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-6"
        >
          <Plus size={20} /> New Habit
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Daily Focus</h3>
            <span className="text-xs text-slate-500">{habits.length} Habits</span>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {habits.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-16 text-center rounded-3xl bg-slate-900/30 border border-dashed border-slate-800 text-slate-500"
                >
                  <Target className="mx-auto mb-4 opacity-20" size={48} />
                  <p className="text-lg font-medium">No habits tracked yet.</p>
                  <p className="text-sm">Start your journey by creating your first habit.</p>
                </motion.div>
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
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-blue-500" size={20} />
              <h3 className="font-semibold text-slate-100">Quick Stats</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="block text-xs text-slate-500 mb-1 uppercase tracking-wider">Total</span>
                <span className="text-2xl font-bold text-slate-100">{stats.totalHabits}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="block text-xs text-slate-500 mb-1 uppercase tracking-wider">Today</span>
                <span className="text-2xl font-bold text-emerald-400">{stats.completedToday}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-500" size={20} />
              <h3 className="font-semibold text-slate-100">Weekly Activity</h3>
            </div>
            <BarChart data={weeklyData} />
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-blue-500" size={20} />
              <h3 className="font-semibold text-slate-100">Consistency Map</h3>
            </div>
            <Heatmap data={heatmapData} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-slate-100">Create New Habit</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Habit Title</label>
                <input 
                  className="input-field"
                  value={newHabit.title}
                  onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                  placeholder="e.g., Morning Meditation"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                <select 
                  className="input-field"
                  value={newHabit.categoryId}
                  onChange={e => setNewHabit({...newHabit, categoryId: e.target.value})}
                  required
                >
                  <option value="" className="bg-slate-900">Select Category</option>
                  {categories && categories.length > 0 ? (
                    categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
                    ))
                  ) : (
                    <option disabled>Loading categories...</option>
                  )}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary"
                >
                  Create Habit
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
