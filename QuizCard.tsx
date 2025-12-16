import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizState } from '../types';
import { Clock, CheckCircle, XCircle, ChevronRight, Music, Play } from 'lucide-react';
import { generateDailyQuiz } from '../services/geminiService';

interface QuizCardProps {
  onComplete: (score: number) => void;
}

const TOTAL_TIME_PER_QUESTION = 20; // Seconds

const QuizCard: React.FC<QuizCardProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gameState, setGameState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: {},
    isCompleted: false,
    timeRemaining: TOTAL_TIME_PER_QUESTION
  });
  const [selectedOption, setSelectedOption] = useState<string | string[]>("");
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const data = await generateDailyQuiz();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeUp = useCallback(() => {
    if (isAnswerRevealed || gameState.isCompleted) return;
    handleSubmitAnswer(null); // Auto submit null if time runs out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnswerRevealed, gameState.isCompleted]);

  useEffect(() => {
    if (loading || gameState.isCompleted || isAnswerRevealed) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          handleTimeUp();
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 0.1 };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [loading, gameState.isCompleted, isAnswerRevealed, handleTimeUp]);

  const handleSubmitAnswer = (answer: string | string[] | null) => {
    setIsAnswerRevealed(true);
    const currentQuestion = questions[gameState.currentQuestionIndex];
    
    // Calculate Score Logic: BasePoints * (Remaining / Total)
    let pointsEarned = 0;
    const isCorrect = answer && checkAnswer(currentQuestion, answer);

    if (isCorrect) {
      const timeFactor = Math.max(0.1, gameState.timeRemaining / TOTAL_TIME_PER_QUESTION);
      pointsEarned = Math.round(currentQuestion.points * timeFactor);
    }

    setGameState(prev => ({
      ...prev,
      score: prev.score + pointsEarned,
      answers: { ...prev.answers, [currentQuestion.id]: answer }
    }));
  };

  const handleNext = () => {
    if (gameState.currentQuestionIndex >= questions.length - 1) {
      setGameState(prev => ({ ...prev, isCompleted: true }));
      onComplete(gameState.score);
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: TOTAL_TIME_PER_QUESTION
      }));
      setSelectedOption("");
      setIsAnswerRevealed(false);
    }
  };

  const checkAnswer = (q: Question, ans: string | string[]) => {
    if (Array.isArray(q.correctAnswer) && Array.isArray(ans)) {
        return JSON.stringify(q.correctAnswer.sort()) === JSON.stringify(ans.sort());
    }
    return q.correctAnswer.toString().toLowerCase() === ans.toString().toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-kolly-neon border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-kolly-neon font-display animate-pulse">Generating Daily Vibe...</p>
      </div>
    );
  }

  if (gameState.isCompleted) {
    return (
      <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto text-center border-kolly-neon">
        <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-kolly-gold to-kolly-pink mb-6">
          VIBE CHECK COMPLETE
        </h2>
        <div className="text-6xl font-black text-white mb-2">{Math.round(gameState.score)}</div>
        <p className="text-gray-400 mb-8 uppercase tracking-widest">Total Points</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-black/30 p-4 rounded-xl border border-white/10">
             <div className="text-kolly-neon text-xl font-bold">{questions.length}</div>
             <div className="text-xs text-gray-500">Questions</div>
           </div>
           <div className="bg-black/30 p-4 rounded-xl border border-white/10">
             <div className="text-kolly-pink text-xl font-bold">A+</div>
             <div className="text-xs text-gray-500">Rank</div>
           </div>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="bg-kolly-neon hover:bg-cyan-300 text-black font-bold py-3 px-8 rounded-full transition-all"
        >
          Play Again
        </button>
      </div>
    );
  }

  const currentQ = questions[gameState.currentQuestionIndex];
  const progressPercent = (gameState.timeRemaining / TOTAL_TIME_PER_QUESTION) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full mb-6 overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${
            progressPercent < 30 ? 'bg-red-500' : 'bg-kolly-neon'
          }`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="glass-panel rounded-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-kolly-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Header: Score and Timer */}
        <div className="flex justify-between items-center mb-8 relative z-10">
           <span className="text-gray-400 font-display text-sm">
             QUESTION {gameState.currentQuestionIndex + 1} / {questions.length}
           </span>
           <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 text-kolly-gold">
               <span className="font-bold text-xl">{Math.round(gameState.score)}</span>
               <span className="text-xs uppercase">Pts</span>
             </div>
             <div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-lg border border-white/10">
               <Clock className="w-4 h-4 text-kolly-neon" />
               <span className="font-mono text-lg w-10 text-right">{Math.ceil(gameState.timeRemaining)}s</span>
             </div>
           </div>
        </div>

        {/* Question Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight relative z-10">
          {currentQ.text}
        </h2>

        {/* Media (If Exists) */}
        {currentQ.mediaUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-white/10 relative group">
             {currentQ.mediaType === 'image' && (
               <img src={currentQ.mediaUrl} alt="Clue" className="w-full h-48 md:h-64 object-cover" />
             )}
             {currentQ.mediaType === 'audio' && (
                <div className="h-24 bg-gradient-to-r from-kolly-purple to-black flex items-center justify-center">
                    <Music className="w-12 h-12 text-kolly-pink animate-bounce" />
                    <audio controls src={currentQ.mediaUrl} className="absolute bottom-2 w-11/12" />
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-3 relative z-10">
          {currentQ.type === 'radio' && currentQ.options?.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQ.correctAnswer;
            
            let btnClass = "border-white/10 hover:bg-white/5 hover:border-kolly-neon/50";
            if (isAnswerRevealed) {
              if (isCorrect) btnClass = "bg-green-500/20 border-green-500 text-green-300";
              else if (isSelected) btnClass = "bg-red-500/20 border-red-500 text-red-300";
              else btnClass = "opacity-50 border-white/10";
            } else if (isSelected) {
              btnClass = "bg-kolly-neon/20 border-kolly-neon text-white";
            }

            return (
              <button
                key={idx}
                disabled={isAnswerRevealed}
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${btnClass}`}
              >
                <span className="font-medium text-lg">{option}</span>
                {isAnswerRevealed && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                {isAnswerRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
              </button>
            );
          })}

          {currentQ.type === 'text' && (
             <div className="relative">
                <input 
                  type="text" 
                  disabled={isAnswerRevealed}
                  value={selectedOption as string}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full bg-black/40 border-2 border-white/10 rounded-xl p-4 text-white focus:border-kolly-neon focus:outline-none transition-colors"
                />
                {isAnswerRevealed && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-400">Correct Answer: </span>
                    <span className="text-kolly-neon font-bold">{currentQ.correctAnswer}</span>
                  </div>
                )}
             </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end">
          {!isAnswerRevealed ? (
            <button
              onClick={() => handleSubmitAnswer(selectedOption)}
              disabled={!selectedOption && currentQ.type !== 'text'} // Allow text input to submit even if empty (marked wrong)
              className="bg-gradient-to-r from-kolly-neon to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(0,242,234,0.4)] disabled:opacity-50 disabled:shadow-none transition-all"
            >
              Lock Answer
            </button>
          ) : (
             <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg border border-white/20 transition-all"
            >
              <span>{gameState.currentQuestionIndex >= questions.length - 1 ? "Finish Quiz" : "Next Question"}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
