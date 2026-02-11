export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  createdAt: any;
}

export interface Question {
  question: string;
  options: string[];
  answer: number; // Index 0-3
  explanation: string;
}

export interface QuestionPaper {
  id: string;
  subjectName: string;
  title?: string; // Kept for transition safety
  questions: Question[];
  createdAt: any;
}

export interface ExamResult {
  paperId: string;
  paperTitle: string;
  score: number;
  totalQuestions: number;
  userAnswers: number[];
  questions: Question[];
  timestamp: string;
}