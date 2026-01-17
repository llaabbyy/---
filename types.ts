
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface QuizState {
  userName: string;
  difficulty: Difficulty;
  currentQuestionIndex: number;
  answers: Record<number, number>;
  timeRemaining: number;
  isFinished: boolean;
  startTime: number;
}

export interface DifficultyConfig {
  label: string;
  timeMinutes: number;
  color: string;
}
