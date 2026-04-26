import api from './api';

export const getAllQuestions = (params: Record<string, unknown> = {}) => {
  return api.get('/questions', { params });
};

export const createQuestion = (questionData: Record<string, unknown>) => {
  return api.post('/questions', questionData);
};
