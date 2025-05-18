import { apiClient } from '../client';
import { Achievement, UserAchievement } from '../types';

export const achievementService = {
  async getAchievements(params?: {
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<Achievement[]> {
    const response = await apiClient.get<Achievement[] | { results: Achievement[] }>('/achievements/', { params });
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  },

  async getAchievement(id: number): Promise<Achievement> {
    return apiClient.get<Achievement>(`/achievements/${id}/`);
  },

  async getUserAchievements(params?: {
    user?: number;
    page?: number;
    page_size?: number;
  }): Promise<UserAchievement[]> {
    const response = await apiClient.get<UserAchievement[] | { results: UserAchievement[] }>('/user-achievements/', { params });
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  },

  async getCurrentUserAchievements(): Promise<UserAchievement[]> {
    const response = await apiClient.get<UserAchievement[] | { results: UserAchievement[] }>('/users/me/achievements/');
    if (response && typeof response === 'object' && 'results' in response) {
      return response.results;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  },
};
