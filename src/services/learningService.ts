import api from './api';

export type LevelItem = {
  id: number;
  name: string;
};

export type SubjectItem = {
  id: number;
  name: string;
  imageUrl?: string;
  levelId: number;
  levelName: string;
};

export type TopicItem = {
  id: number;
  name: string;
  subjectId: number;
  subjectName: string;
  levelId: number;
  levelName: string;
};

export const getLevels = () => {
  return api.get('/learning/levels');
};

export const getSubjects = () => {
  return api.get('/learning/subjects');
};

export const getTopics = () => {
  return api.get('/learning/topics');
};