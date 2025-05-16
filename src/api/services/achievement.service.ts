import { apiClient } from '../client';
import { Achievement, UserAchievement } from '../types';

export const achievementService = {
  async getAchievements(params?: {
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<Achievement[]> {
    return apiClient.get<Achievement[]>('/achievements/', { params });
  },

  async getAchievement(id: number): Promise<Achievement> {
    return apiClient.get<Achievement>(`/achievements/${id}/`);
  },

  async getUserAchievements(params?: {
    user?: number;
    page?: number;
    page_size?: number;
  }): Promise<UserAchievement[]> {
    return apiClient.get<UserAchievement[]>('/user-achievements/', { params });
  },

  async getCurrentUserAchievements(): Promise<UserAchievement[]> {
    return apiClient.get<UserAchievement[]>('/users/me/achievements/');
  },
};
