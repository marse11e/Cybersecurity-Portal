import { apiClient } from '../client';
import { Article } from '../types';

export const articleService = {
  async getArticles(params?: {
    category?: string;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<Article[]> {
    try {
      // Создаем копию параметров для модификации
      const apiParams: Record<string, any> = {};
      
      // Копируем допустимые параметры
      if (params) {
        if (params.category) apiParams.category = params.category;
        if (params.search) apiParams.search = params.search;
        if (params.ordering) apiParams.ordering = params.ordering;
        if (params.page) apiParams.page = params.page;
        // Проверяем подходящий параметр для размера страницы
        if (params.page_size) apiParams.limit = params.page_size; // Переименовываем в limit
      }
      
      const response = await apiClient.get<Article[] | { results: Article[] }>('/articles/', { params: apiParams });
      
      // Обработка как пагинированных результатов, так и простых массивов
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      // Проверка, что ответ является массивом
      if (Array.isArray(response)) {
        return response;
      }
      
      console.error('Неожиданный формат ответа API:', response);
      return [];
    } catch (error) {
      console.error('Ошибка при получении статей:', error);
      return [];
    }
  },

  async getArticle(id: number): Promise<Article | null> {
    try {
      const article = await apiClient.get<Article>(`/articles/${id}/`);
      return article;
    } catch (error) {
      console.error(`Ошибка при получении статьи ${id}:`, error);
      return null;
    }
  },
  
  async likeArticle(id: number): Promise<any> {
    try {
      return await apiClient.post<any>(`/articles/${id}/like/`, {});
    } catch (error) {
      console.error(`Ошибка при лайке статьи ${id}:`, error);
      throw error;
    }
  },
  
  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const response = await apiClient.get<Article[] | { results: Article[] }>('/articles/featured/');
      
      // Обработка как пагинированных результатов, так и простых массивов
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      // Проверка, что ответ является массивом
      if (Array.isArray(response)) {
        return response;
      }
      
      console.error('Неожиданный формат ответа API для избранных статей:', response);
      return [];
    } catch (error) {
      console.error('Ошибка при получении избранных статей:', error);
      return [];
    }
  },
}; 