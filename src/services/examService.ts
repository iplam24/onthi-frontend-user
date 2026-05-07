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
