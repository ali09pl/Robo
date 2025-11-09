export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  streak: number;
  xp: number;
  hearts: number;
  totalXP: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  lessons: Lesson[];
  createdAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  exercises: Exercise[];
  createdAt: Date;
}

export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  type: 'code' | 'quiz' | 'project';
  initialCode?: string;
  testCases?: TestCase[];
  expectedOutput?: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestCase {
  input: string;
  output: string;
  description: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  attemptCount: number;
  completedAt?: Date;
  createdAt: Date;
}

export interface LevelAssessment {
  id: string;
  userId: string;
  language: string;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  completedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  certificateUrl: string;
}
