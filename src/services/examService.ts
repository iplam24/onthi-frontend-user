import api from './api';

export type GetAllExamsParams = {
  page?: number;
  size?: number;
  sort?: string;
  subjectName?: string;
};

export type ExamSection = {
  title: string;
  questions: any[];
};

export type ExamResponse = {
  id: number;
  title: string;
  description?: string;
  duration: number;
  uiLayoutHint?: 'STANDARD' | 'LITERATURE' | 'ESSAY' | 'MIXED';
  sections?: ExamSection[];
  questions?: any[];
};

// --- Random Exam Types ---

export type DifficultyConfig = {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  count: number;
};

export type TopicConfig = {
  topicId: number;
  count: number;
};

export type TopicDetailedConfig = {
  topicId: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
};

export type RandomExamRequest = {
  subjectId: number;
  totalQuestions: number;
  duration: number;
  difficultyConfigs?: DifficultyConfig[];
  topicConfigs?: TopicConfig[];
  topicDetailedConfigs?: TopicDetailedConfig[];
  allowRetake?: boolean;
  maxAttempts?: number;
  avoidDuplicates?: boolean;
  title?: string;
};

export type RandomExamResponse = {
  examId: number;
  title: string;
  subjectId: number;
  subjectName: string;
  duration: number;
  totalQuestions: number;
  difficultyDistribution: Record<string, number>;
  topicDistribution: Record<string, number>;
  allowRetake: boolean;
  maxAttempts: number | null;
  hasDuplicates: boolean;
  createdAt: string;
};

export type TopicAnalysis = {
  topicId: number | null;
  topicName: string;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  rating: 'STRONG' | 'AVERAGE' | 'WEAK';
};

export type DifficultyAnalysis = {
  difficulty: string;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  rating: string;
};

export type WeaknessItem = {
  area: string;
  type: 'TOPIC' | 'DIFFICULTY';
  percentage: number;
  description: string;
};

export type ProgressComparison = {
  previousScore: number | null;
  currentScore: number | null;
  improvement: number | null;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'FIRST_ATTEMPT';
  attemptNumber: number;
};

export type ExamPerformanceResponse = {
  attemptId: number;
  examId: number;
  examTitle: string;
  score: number;
  percentage: number;
  overallRating: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'WEAK' | 'VERY_WEAK';
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalQuestions: number;
  durationTaken: number;
  topicAnalyses: TopicAnalysis[];
  difficultyAnalyses: DifficultyAnalysis[];
  weaknesses: WeaknessItem[];
  recommendations: string[];
  progressComparison: ProgressComparison | null;
};

export type UserExamHistoryItem = {
  examId: number;
  examTitle: string;
  subjectId: number;
  subjectName: string;
  attemptCount: number;
  maxAttempts: number | null;
  canRetake: boolean;
  bestScore: number | null;
  latestScore: number | null;
  lastAttemptAt: string | null;
  examType: string;
};

// --- Existing APIs ---

export const getAllExams = (params: GetAllExamsParams = {}) => {
  return api.get('/exams', { params });
};

export const getExamById = (examId: number) => {
  return api.get(`/exams/${examId}`);
};

export const getExamsBySubject = (subjectId: number, params: Record<string, unknown> = {}) => {
  return api.get(`/exams/subjects/${subjectId}`, { params });
};

export const createExam = (examData: Record<string, unknown>) => {
  return api.post('/exams', examData);
};

// --- Random Exam APIs ---

export const generateRandomExam = (data: RandomExamRequest) => {
  return api.post('/exams/random', data);
};

export const getMyExamHistory = (params: { subjectId?: number; page?: number; size?: number } = {}) => {
  return api.get('/exams/me/history', { params });
};

export const checkRetakeEligibility = (examId: number) => {
  return api.get(`/exams/${examId}/retake-check`);
};

export const getAttemptPerformance = (attemptId: number) => {
  return api.get(`/exams/attempts/${attemptId}/performance`);
};

