export type QuestionType = 'text' | 'radio' | 'checkbox';

export interface Question {
  id: string;
  text: string;
  mediaUrl?: string; // Image, Audio, or Video URL
  mediaType?: 'image' | 'video' | 'audio';
  type: QuestionType;
  options?: string[]; // For radio/checkbox
  correctAnswer: string | string[]; // String for text/radio, array for checkbox
  points: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  totalPoints: number;
  role: 'user' | 'admin';
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, any>;
  isCompleted: boolean;
  timeRemaining: number; // in seconds
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
}
