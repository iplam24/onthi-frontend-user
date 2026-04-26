import api from './api';

type SubmitAnswerPayload = {
  questionId: number;
  selectedOptionId: number | null;
  essayAnswer: string | null;
};

type SubmitAttemptPayload = {
  answers: SubmitAnswerPayload[];
  tabSwitchCount: number;
  violationScore: number;
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

export const getMyAttempts = (params: Record<string, unknown> = {}) => {
  return api.get('/attempts/me', { params });
};

export const reportViolation = (attemptId: number, violationType: string) => {
  return api.post(`/attempts/${attemptId}/violations`, { type: violationType });
};
