import React, { useState } from 'react';
import Header from './components/Header';
import QuizCard from './components/QuizCard';
import AdminPanel from './components/AdminPanel';
import Leaderboard from './components/Leaderboard';
import { User } from './types';
import { ArrowRight, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Simulating Firebase Auth Login
    setUser({
      id: '123',
      name: 'Kolly King',
      avatar: 'https://picsum.photos/seed/me/200',
      totalPoints: 1540,
      role: 'admin' // Auto-admin for demo purposes
    });
  };

  const handleQuizComplete = (score: number) => {
    if (user) {
      setUser({ ...user, totalPoints: user.totalPoints + Math.round(score) });
    }
  };

  return (
    <div className="min-h-screen bg-[#050314] text-white overflow-x-hidden selection:bg-kolly-pink selection:text-white pb-12">
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none z-0"></div>
      
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-kolly-purple rounded-full blur-[120px] opacity-30 z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-kolly-neon rounded-full blur-[120px] opacity-10 z-0"></div>

      <div className="relative z-10">
        <Header 
          user={user} 
          onLogin={handleLogin} 
          currentView={currentView}
          onNavigate={setCurrentView}
        />

        <main className="px-4">
          {currentView === 'home' && (
            <div className="flex flex-col items-center">
              {/* Hero Section */}
              <div className="max-w-4xl w-full text-center mb-12 mt-8">
                <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 animate-pulse">
                   <Sparkles className="w-4 h-4 text-kolly-gold" />
                   <span className="text-xs font-bold tracking-widest uppercase text-gray-300">Daily Challenge Live</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 mb-6 drop-shadow-2xl">
                  GUESS THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-kolly-neon to-blue-500">VIBE</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 font-body">
                  Test your knowledge on Tamil Cinema's most iconic moments, BGM drops, and mass dialogues. 
                  Compete daily and climb the Chennai ranks.
                </p>
                
                {!user ? (
                   <button 
                     onClick={handleLogin}
                     className="bg-kolly-pink hover:bg-pink-600 text-white text-lg font-bold py-4 px-10 rounded-full shadow-[0_0_25px_rgba(255,0,85,0.4)] transition-all hover:scale-105"
                   >
                     Login to Play
                   </button>
                ) : (
                   <button 
                     onClick={() => setCurrentView('quiz')}
                     className="group bg-kolly-neon hover:bg-cyan-300 text-black text-lg font-bold py-4 px-12 rounded-full shadow-[0_0_25px_rgba(0,242,234,0.4)] transition-all hover:scale-105 flex items-center mx-auto space-x-2"
                   >
                     <span>Start Daily Quiz</span>
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </button>
                )}
              </div>

              {/* Decorative Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full opacity-60 hover:opacity-100 transition-opacity">
                 <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-kolly-neon font-bold text-xl mb-2">90s Kids</h3>
                    <p className="text-sm text-gray-400">Rahman hits and Rajini styles. The golden era trivia.</p>
                 </div>
                 <div className="bg-black/40 border border-white/10 p-6 rounded-2xl transform md:-translate-y-4">
                    <h3 className="text-kolly-pink font-bold text-xl mb-2">LCU Connect</h3>
                    <p className="text-sm text-gray-400">Decode the universe connections. Rolex is watching.</p>
                 </div>
                 <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-kolly-gold font-bold text-xl mb-2">Comedy Gold</h3>
                    <p className="text-sm text-gray-400">Vadivelu reactions for every life situation.</p>
                 </div>
              </div>
            </div>
          )}

          {currentView === 'quiz' && (
             <QuizCard onComplete={handleQuizComplete} />
          )}

          {currentView === 'admin' && user?.role === 'admin' && (
            <AdminPanel />
          )}

          {currentView === 'leaderboard' && (
            <Leaderboard />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
