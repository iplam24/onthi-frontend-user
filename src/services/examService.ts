import api from './api';

export type GetAllExamsParams = {
  page?: number;
  size?: number;
  sort?: string;
  subjectName?: string;
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
