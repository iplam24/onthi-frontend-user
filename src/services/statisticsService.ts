import api from './api';

export type DashboardStatistics = {
  totalUsers: number;
  newUsersToday: number;
  totalQuestions: number;
  totalExams: number;
  totalAttempts: number;
  totalSubjects: number;
  totalLevels: number;
  totalTopics: number;
};

export const getDashboardStatistics = () => {
  return api.get('/statistics/dashboard');
};

