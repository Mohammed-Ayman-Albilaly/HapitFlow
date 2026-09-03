import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight">
          Master Your Life <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            With Precision.
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          A premium habit tracking experience designed for those who demand consistency. 
          Visualize your progress with futuristic analytics and glassmorphic design.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/register" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-xl shadow-blue-500/30"
          >
            Start Your Journey
          </Link>
          <Link 
            to="/dashboard" 
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold transition-all border border-slate-700"
          >
            View Demo
          </Link>
        </div>
      </motion.div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full z-10">
        {[
          { title: 'Futuristic UI', desc: 'Glassmorphic cards and smooth animations for a premium feel.', icon: '✨' },
          { title: 'Deep Analytics', desc: 'Heatmaps and bar charts to visualize your consistency.', icon: '📊' },
          { title: 'Streak Engine', desc: 'Intelligent daily and weekly tracking to keep you motivated.', icon: '🔥' },
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 hover:border-blue-500/50 transition-colors group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
