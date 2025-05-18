import { apiClient } from '../client';
import { Article } from '../types';

export const articleService = {
  async getArticles(params?: {
    category?: string | number | { id: number };
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    categoriesList?: { id: number; slug: string; name: string }[];
  }): Promise<Article[]> {
    try {
      const apiParams: Record<string, any> = {};
      if (params) {
        if (params.category !== undefined && params.category !== null) {
          if (typeof params.category === 'object' && 'id' in params.category) {
            apiParams.category = params.category.id;
          } else if (typeof params.category === 'number') {
            apiParams.category = params.category;
          } else if (typeof params.category === 'string' && params.categoriesList) {
            const found = params.categoriesList.find(cat => cat.slug === params.category || cat.name === params.category);
            if (found) apiParams.category = found.id;
          }
        }
        if (params.search) apiParams.search = params.search;
        if (params.ordering) apiParams.ordering = params.ordering;
        if (params.page) apiParams.page = params.page;
        if (params.page_size) apiParams.page_size = params.page_size;
      }
      const response = await apiClient.get<Article[] | { results: Article[] }>('/articles/', { params: apiParams });
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  async getArticle(id: number): Promise<Article | null> {
    try {
      return await apiClient.get<Article>(`/articles/${id}/`);
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return null;
      }
      throw error;
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
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      return [];
    }
  },
}; 