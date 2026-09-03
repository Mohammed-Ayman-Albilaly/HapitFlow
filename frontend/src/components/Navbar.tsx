import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-slate-900/50 border-b border-slate-800">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
        HabitFlow
      </Link>
      <div className="flex gap-4">
        {!token ? (
          <>
            <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-white transition">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full transition shadow-lg shadow-blue-500/20">Get Started</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="px-4 py-2 text-slate-300 hover:text-white transition">Dashboard</Link>
            <button onClick={handleLogout} className="px-4 py-2 text-red-400 hover:text-red-300 transition">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
