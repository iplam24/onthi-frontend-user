import api from './api';

export interface QuestionOption {
  id?: number;
  content: string;
  isCorrect: boolean;
}

export type QuestionType = 'MCQ' | 'ESSAY' | 'LISTENING' | 'SPEAKING';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ContentFormat = 'PLAIN_TEXT' | 'LATEX';

export interface QuestionRequest {
  content: string;
  contentFormat?: ContentFormat;
  url?: string;
  type: QuestionType;
  difficulty: Difficulty;
  topicId: number;
  options?: QuestionOption[];
  sampleAnswer?: string;
  explanation?: string;
}

export const getAllQuestions = (params: { topicId?: number; page?: number; size?: number; sort?: string } = {}) => {
  return api.get('/questions', { params });
};

export const createQuestion = (questionData: QuestionRequest) => {
  return api.post('/questions', questionData);
};

export const getQuestionById = (id: number) => {
  return api.get(`/questions/${id}`);
};

export const updateQuestion = (id: number, questionData: QuestionRequest) => {
  return api.put(`/questions/${id}`, questionData);
};
