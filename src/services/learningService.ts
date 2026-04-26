import api from './api';

export type SubjectItem = {
  id: number;
  name: string;
  imageUrl?: string;
  levelId: number;
  levelName: string;
};

export const getSubjects = () => {
  return api.get('/learning/subjects');
};