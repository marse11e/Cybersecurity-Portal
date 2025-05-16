import { apiClient } from '../client';
import { AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/token/', { email, password });
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register/', userData);
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    return apiClient.post<{ access: string }>('/auth/token/refresh/', { refresh });
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me/');
  },
}; 