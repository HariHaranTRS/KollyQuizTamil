import React, { useState } from 'react';
import { Question, QuestionType } from '../types';
import { Plus, Trash2, Save, Image, Video, Music } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQ, setNewQ] = useState<Partial<Question>>({
    type: 'radio',
    options: ['', '', '', ''],
    points: 100,
    correctAnswer: ''
  });

  const handleAddQuestion = () => {
    if (!newQ.text || !newQ.correctAnswer) {
      alert("Please fill in the question and correct answer.");
      return;
    }
    
    const q: Question = {
      id: Date.now().toString(),
      text: newQ.text,
      type: newQ.type || 'radio',
      options: newQ.options,
      points: newQ.points || 100,
      correctAnswer: newQ.correctAnswer,
      mediaUrl: newQ.mediaUrl,
      mediaType: newQ.mediaType
    };

    setQuestions([...questions, q]);
    // Reset form partially
    setNewQ({
      type: 'radio',
      options: ['', '', '', ''],
      points: 100,
      correctAnswer: '',
      text: '',
      mediaUrl: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Admin Dashboard</h2>
          <p className="text-gray-400">Manage Daily Vibe Challenges</p>
        </div>
        <button className="bg-kolly-pink hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-bold flex items-center space-x-2 shadow-[0_0_15px_rgba(255,0,85,0.4)]">
          <Save className="w-4 h-4" />
          <span>Publish Quiz</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Builder */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border-t-4 border-t-kolly-neon">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-kolly-neon" />
            Add New Question
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Question Text</label>
              <textarea 
                value={newQ.text || ''}
                onChange={(e) => setNewQ({...newQ, text: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-kolly-neon outline-none"
                placeholder="e.g., Which movie is this BGM from?"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Answer Type</label>
                 <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                   {(['text', 'radio', 'checkbox'] as QuestionType[]).map(type => (
                     <button
                        key={type}
                        onClick={() => setNewQ({...newQ, type})}
                        className={`flex-1 capitalize text-sm py-1.5 rounded-md transition-colors ${newQ.type === type ? 'bg-kolly-purple text-white' : 'text-gray-500 hover:text-gray-300'}`}
                     >
                       {type}
                     </button>
                   ))}
                 </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Points</label>
                <input 
                  type="number" 
                  value={newQ.points}
                  onChange={(e) => setNewQ({...newQ, points: parseInt(e.target.value)})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Media Attachment (Optional)</label>
              <div className="flex space-x-2 mb-2">
                 {(['image', 'video', 'audio'] as const).map(mType => (
                    <button
                      key={mType}
                      onClick={() => setNewQ(prev => ({...prev, mediaType: prev.mediaType === mType ? undefined : mType}))}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs border ${newQ.mediaType === mType ? 'border-kolly-neon text-kolly-neon bg-kolly-neon/10' : 'border-white/10 text-gray-500'}`}
                    >
                       {mType === 'image' && <Image className="w-3 h-3" />}
                       {mType === 'video' && <Video className="w-3 h-3" />}
                       {mType === 'audio' && <Music className="w-3 h-3" />}
                       <span className="capitalize">{mType}</span>
                    </button>
                 ))}
              </div>
              {newQ.mediaType && (
                 <input 
                  type="text" 
                  value={newQ.mediaUrl || ''}
                  onChange={(e) => setNewQ({...newQ, mediaUrl: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm"
                  placeholder={`Paste ${newQ.mediaType} URL here...`}
                />
              )}
            </div>

            {/* Options Logic */}
            {newQ.type === 'radio' && (
              <div className="space-y-2">
                 <label className="block text-sm text-gray-400">Options</label>
                 {newQ.options?.map((opt, idx) => (
                   <div key={idx} className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center text-xs text-gray-500">{String.fromCharCode(65+idx)}</div>
                      <input 
                        type="text" 
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...(newQ.options || [])];
                          newOpts[idx] = e.target.value;
                          setNewQ({...newQ, options: newOpts});
                        }}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm"
                        placeholder={`Option ${idx + 1}`}
                      />
                      <input 
                        type="radio" 
                        name="correctAnswerGroup"
                        checked={newQ.correctAnswer === opt && opt !== ''}
                        onChange={() => setNewQ({...newQ, correctAnswer: opt})}
                        className="accent-kolly-neon"
                      />
                   </div>
                 ))}
                 <p className="text-xs text-gray-500 text-right">* Select the radio button for the correct answer</p>
              </div>
            )}

            {newQ.type === 'text' && (
              <div>
                 <label className="block text-sm text-gray-400 mb-1">Correct Answer</label>
                 <input 
                  type="text" 
                  value={newQ.correctAnswer as string || ''}
                  onChange={(e) => setNewQ({...newQ, correctAnswer: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                  placeholder="Exact answer text match..."
                />
              </div>
            )}

            <button 
              onClick={handleAddQuestion}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg mt-4 transition-colors"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Preview List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Draft Queue ({questions.length})</h3>
          {questions.length === 0 && (
            <div className="text-gray-500 text-center py-10 border border-dashed border-gray-700 rounded-xl">
              No questions added yet.
            </div>
          )}
          {questions.map((q, i) => (
            <div key={q.id} className="bg-black/40 p-4 rounded-lg border border-white/5 flex justify-between items-start group hover:border-kolly-neon/30 transition-all">
               <div>
                  <span className="text-kolly-neon text-xs font-bold mb-1 block">Q{i+1} • {q.points} PTS</span>
                  <p className="text-white text-sm line-clamp-2">{q.text}</p>
                  <p className="text-gray-500 text-xs mt-1">Ans: {q.correctAnswer}</p>
               </div>
               <button 
                onClick={() => setQuestions(questions.filter(qi => qi.id !== q.id))}
                className="text-gray-600 hover:text-red-500 transition-colors"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
