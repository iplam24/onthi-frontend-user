import api from './api';

export interface CountdownItem {
  id: number;
  title: string;
  examDate: string;
  levelId: number;
  levelName: string;
}

export const getCountdowns = () => {
  return api.get('/countdowns');
};

export const createCountdown = (data: { title: string; examDate: string; levelId: number }) => {
  return api.post('/countdowns', data);
};

export const updateCountdown = (id: number, data: { title: string; examDate: string; levelId: number }) => {
  return api.put(`/countdowns/${id}`, data);
};

export const deleteCountdown = (id: number) => {
  return api.delete(`/countdowns/${id}`);
};
