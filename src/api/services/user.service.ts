import { apiClient } from '../client';
import { User, UserAchievement, UserActivity } from '../types';

export const userService = {
  async getUser(id: number): Promise<User> {
    return apiClient.get<User>(`/users/${id}/`);
  },

  async updateUserProfile(data: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }): Promise<User> {
    return apiClient.patch<User>('/users/me/', data);
  },

  async changePassword(data: {
    old_password: string;
    new_password: string;
  }): Promise<any> {
    return apiClient.post<any>('/auth/change-password/', data);
  },

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return apiClient.get<UserAchievement[]>(`/users/${userId}/achievements/`);
  },

  async getUserActivities(userId: number): Promise<UserActivity[]> {
    return apiClient.get<UserActivity[]>(`/users/${userId}/activities/`);
  },

  async getDashboard(): Promise<any> {
    return apiClient.get<any>('/dashboard/');
  }
}; 