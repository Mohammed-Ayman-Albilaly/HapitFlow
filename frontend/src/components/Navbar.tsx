import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, Zap, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 group"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <User size={14} />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100">Account</span>
              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel p-2 shadow-2xl z-50">
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <div className="my-2 border-t border-slate-800" />
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
