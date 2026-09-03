import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, Zap } from 'lucide-react';

const Navbar = () => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 px-8 py-4 flex justify-between items-center backdrop-blur-md bg-slate-950/70 border-b border-slate-800/60">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
          <Zap size={18} className="text-white" fill="currentColor" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-100">
          Habit<span className="text-blue-500">Flow</span>
        </span>
      </Link>
      
      <div className="flex items-center gap-6">
        {!token ? (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get Started
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
