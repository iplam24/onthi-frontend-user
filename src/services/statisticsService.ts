import api from './api';

export type DashboardStatistics = {
  totalUsers: number;
  newUsersToday: number;
  totalQuestions: number;
  totalExams: number;
  totalAttempts: number;
  totalSubjects: number;
  totalLevels: number;
  totalTopics: number;
};

export type SubjectEvaluationResponse = {
  subjectId: number;
  subjectName: string;
  levelId: number;
  levelName: string;
  attemptCount: number;
  averageScore: number;
  accuracyRate: number;
  bestScore: number;
  latestScore: number;
  averageDurationSeconds: number;
};

export type TopicEvaluationResponse = {
  topicId: number;
  topicName: string;
  subjectId: number;
  subjectName: string;
  totalAnswers: number;
  correctAnswers: number;
  accuracyRate: number;
  averageScore: number;
};

export type DifficultyEvaluationResponse = {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  totalAnswers: number;
  correctAnswers: number;
  accuracyRate: number;
  averageScore: number;
};

export type StudentEvaluationResponse = {
  userId: number;
  username: string;
  fullName?: string;
  levelName?: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  latestScore: number;
  knowledgeScore: number;
  speedScore: number;
  progressScore: number;
  disciplineScore: number;
  overallScore: number;
  performanceLabel: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  subjectEvaluations?: SubjectEvaluationResponse[];
  topicEvaluations?: TopicEvaluationResponse[];
  difficultyEvaluations?: DifficultyEvaluationResponse[];
};

export const getDashboardStatistics = () => {
  return api.get('/statistics/dashboard');
};

export const getStudentEvaluation = (params: Record<string, any> = {}) => {
  return api.get('/statistics/me/evaluation', { params });
};
