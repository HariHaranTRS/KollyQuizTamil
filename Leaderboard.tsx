import React from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK_DATA: LeaderboardEntry[] = [
  { rank: 1, user: { id: '1', name: 'Vijay Fan', avatar: 'https://picsum.photos/seed/u1/100', totalPoints: 12450, role: 'user' } },
  { rank: 2, user: { id: '2', name: 'Thala Blood', avatar: 'https://picsum.photos/seed/u2/100', totalPoints: 11200, role: 'user' } },
  { rank: 3, user: { id: '3', name: 'Ani Music', avatar: 'https://picsum.photos/seed/u3/100', totalPoints: 10850, role: 'user' } },
  { rank: 4, user: { id: '4', name: 'CinePhile99', avatar: 'https://picsum.photos/seed/u4/100', totalPoints: 9500, role: 'user' } },
  { rank: 5, user: { id: '5', name: 'Chennai Paiyan', avatar: 'https://picsum.photos/seed/u5/100', totalPoints: 8200, role: 'user' } },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      {/* Top 3 Podium */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-20">
             <Trophy className="w-32 h-32 text-kolly-gold" />
           </div>
           <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-kolly-gold to-orange-500 mb-6">
             Wall of Fame
           </h2>

           <div className="space-y-3">
             {MOCK_DATA.map((entry) => {
               let rankColor = "text-gray-400";
               let borderClass = "border-white/5";
               if (entry.rank === 1) { rankColor = "text-kolly-gold"; borderClass="border-kolly-gold/50 bg-kolly-gold/10"; }
               if (entry.rank === 2) { rankColor = "text-gray-300"; borderClass="border-gray-300/50 bg-gray-300/10"; }
               if (entry.rank === 3) { rankColor = "text-orange-700"; borderClass="border-orange-700/50 bg-orange-700/10"; }

               return (
                 <div key={entry.user.id} className={`flex items-center p-4 rounded-xl border ${borderClass} transition-transform hover:scale-[1.01]`}>
                    <div className={`text-2xl font-black w-12 ${rankColor}`}>
                      #{entry.rank}
                    </div>
                    <img src={entry.user.avatar} alt={entry.user.name} className="w-12 h-12 rounded-full border-2 border-white/20 mr-4" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{entry.user.name}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Master</p>
                    </div>
                    <div className="text-right">
                       <div className="text-kolly-neon font-mono font-bold text-xl">{entry.user.totalPoints}</div>
                       <div className="text-[10px] text-gray-500 uppercase">Points</div>
                    </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="space-y-6">
         <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-xl font-bold text-white mb-4">Top Performers</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={MOCK_DATA}>
                 <XAxis dataKey="user.name" hide />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#050314', border: '1px solid #333' }}
                    itemStyle={{ color: '#00f2ea' }}
                 />
                 <Bar dataKey="user.totalPoints" radius={[4, 4, 0, 0]}>
                    {MOCK_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ffd700' : '#ff0055'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>

         <div className="bg-gradient-to-br from-kolly-purple to-black p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold mb-2">Submit a Question?</h3>
            <p className="text-gray-400 text-sm mb-4">Got a tricky trivia? Submit it and get featured on the leaderboard.</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors">
              Contribute
            </button>
         </div>
      </div>
    </div>
  );
};

export default Leaderboard;
