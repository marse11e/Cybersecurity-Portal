import { apiClient } from '../client';
import { Category } from '../types';

export const categoryService = {
  async getCategories(params?: {
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[] | { results: Category[] }>('/categories/', { params });
      
      // Проверяем, является ли ответ объектом с полем results (пагинированный ответ)
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      // Если ответ - массив, возвращаем его
      if (Array.isArray(response)) {
        return response;
      }
      
      console.error('Неожиданный формат ответа API для категорий:', response);
      return [];
    } catch (error) {
      console.error('Ошибка при получении категорий:', error);
      return [];
    }
  },

  async getCategory(id: number): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}/`);
  },
};
