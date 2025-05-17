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

  async sendEmailCode(email: string, type: 'register' | 'reset'): Promise<any> {
    return apiClient.post<any>('/auth/send-code/', { email, type });
  },

  async verifyEmailCode(email: string, code: string, type: 'register' | 'reset'): Promise<any> {
    return apiClient.post<any>('/auth/verify-code/', { email, code, type });
  },

  async resetPasswordByCode(email: string, code: string, new_password: string, confirm_password: string): Promise<any> {
    return apiClient.post<any>('/auth/reset-password/', { email, code, new_password, confirm_password });
  },
}; 