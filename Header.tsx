import React from 'react';
import { User } from '../types';
import { Trophy, LogIn, LayoutDashboard, Film, Zap } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, currentView, onNavigate }) => {
  return (
    <nav className="glass-panel sticky top-0 z-50 px-4 py-3 mb-6 border-b border-kolly-pink/30">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-gradient-to-tr from-kolly-neon to-kolly-pink p-2 rounded-lg transform group-hover:rotate-12 transition-transform">
            <Film className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-kolly-neon to-kolly-pink tracking-wider">
              VIBECHECK
            </h1>
            <p className="text-xs text-kolly-neon font-body tracking-widest uppercase opacity-80">Kollywood Edition</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-1">
          <NavButton 
            active={currentView === 'home'} 
            onClick={() => onNavigate('home')}
            icon={<Zap className="w-4 h-4" />}
            label="Daily Quiz"
          />
          <NavButton 
            active={currentView === 'leaderboard'} 
            onClick={() => onNavigate('leaderboard')}
            icon={<Trophy className="w-4 h-4" />}
            label="Leaderboard"
          />
           {user?.role === 'admin' && (
            <NavButton 
              active={currentView === 'admin'} 
              onClick={() => onNavigate('admin')}
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Admin"
            />
          )}
        </div>

        {/* User / Login */}
        <div className="flex items-center space-x-4">
          {user ? (
             <div className="flex items-center space-x-3 bg-kolly-purple/50 px-3 py-1.5 rounded-full border border-kolly-neon/30">
               <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border-2 border-kolly-neon" />
               <span className="hidden sm:block text-sm font-semibold text-white">{user.name}</span>
               <span className="text-xs text-kolly-gold font-bold px-2 py-0.5 bg-black/40 rounded">{user.totalPoints} PTS</span>
             </div>
          ) : (
            <button 
              onClick={onLogin}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            >
              <LogIn className="w-4 h-4" />
              <span>Gmail Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 font-medium ${
      active 
        ? 'bg-kolly-neon/10 text-kolly-neon border border-kolly-neon/50 shadow-[0_0_10px_rgba(0,242,234,0.2)]' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Header;
