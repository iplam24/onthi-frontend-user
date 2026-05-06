import api from './api';

export type SubmitAnswerPayload = {
  questionId: number;
  selectedOptionId: number | null;
  essayAnswer: string | null;
};

export type SubmitAttemptPayload = {
  answers: SubmitAnswerPayload[];
  tabSwitchCount: number;
  violationScore: number;
};

export type AttemptHistoryItem = {
  id: number;
  examId: number;
  examTitle?: string;
  status?: string;
  score?: number;
  correctCount?: number;
  wrongCount?: number;
  totalQuestions?: number;
  startedAt?: string;
  submittedAt?: string;
  subjectId?: number;
  subjectName?: string;
  subjectLevelId?: number;
  subjectLevelName?: string;
  flagged?: boolean;
};

export type AttemptFilterParams = {
  subjectId?: number;
  levelId?: number;
  examId?: number;
  status?: string;
  flagged?: boolean;
  from?: string;
  to?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export const startAttempt = (examId: number) => {
  console.log('[attempt:start] request body', { examId });
  return api.post('/attempts/start', { examId });
};

export const submitAttempt = (attemptId: number, payload: SubmitAttemptPayload) => {
  console.log('[attempt:submit] request body', { attemptId, payload });
  return api.post(`/attempts/${attemptId}/submit`, payload);
};

export const getAttemptById = (attemptId: number) => {
  return api.get(`/attempts/${attemptId}`);
};

export const getMyAttempts = (params: AttemptFilterParams | Record<string, unknown> = {}) => {
  return api.get('/attempts/me', { params });
};

export const reportViolation = (attemptId: number, violationType: string) => {
  return api.post(`/attempts/${attemptId}/violations`, { type: violationType });
};
