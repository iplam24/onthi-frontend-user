import api from './api';

export const getAllQuestions = (params: { topicId?: number; page?: number; size?: number; sort?: string } = {}) => {
  return api.get('/questions', { params });
};

export const createQuestion = (questionData: Record<string, unknown>) => {
  return api.post('/questions', questionData);
};

export const getQuestionById = (id: number) => {
  return api.get(`/questions/${id}`);
};
