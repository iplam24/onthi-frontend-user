import api from './api';

export interface UserStreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activeToday: boolean;
  fireLevel: number;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  roleName: string;
  fullName: string | null;
  schoolName: string | null;
  levelId: number | null;
  levelName: string | null;
  dob: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  streak: UserStreakResponse;
}

export interface UserInformationRequest {
  fullName?: string;
  schoolName?: string;
  levelId?: number;
  dob?: string;
  avatar?: string;
}

export const getUserProfile = () => {
  return api.get<{ data: UserProfileResponse }>('/users/me');
};

export const updateUserProfile = (payload: UserInformationRequest) => {
  return api.put<{ data: UserProfileResponse }>('/users/me/information', payload);
};

export const getUserStreak = () => {
  return api.get<{ data: UserStreakResponse }>('/users/me/streak');
};

export const checkInStreak = () => {
  return api.post<{ data: UserStreakResponse }>('/users/me/streak/check-in');
};
