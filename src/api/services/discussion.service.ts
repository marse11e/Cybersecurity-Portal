import { apiClient } from '../client';
import { Discussion, Reply } from '../types';

export const discussionService = {
  async getDiscussions(params?: {
    category?: string;
    solved?: boolean;
    pinned?: boolean;
    search?: string;
    ordering?: string;
    sort_by?: string;
    page?: number;
    page_size?: number;
  }): Promise<Discussion[]> {
    try {
      const response = await apiClient.get<Discussion[] | { results: Discussion[] }>('/discussions/', { params });
      
      // Проверяем, является ли ответ объектом с полем results (пагинированный ответ)
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      // Если ответ - массив, возвращаем его
      if (Array.isArray(response)) {
        return response;
      }
      
      console.error('Неожиданный формат ответа API:', response);
      return [];
    } catch (err) {
      console.error('Ошибка при получении обсуждений:', err);
      return [];
    }
  },

  async getDiscussion(id: number): Promise<Discussion> {
    return apiClient.get<Discussion>(`/discussions/${id}/`);
  },

  async createDiscussion(data: {
    title: string;
    description: string;
    category: string;
    tags?: string[];
  }): Promise<Discussion> {
    return apiClient.post<Discussion>('/discussions/', data);
  },

  async likeDiscussion(id: number): Promise<any> {
    return apiClient.post<any>(`/discussions/${id}/like/`, {});
  },

  async solveDiscussion(id: number): Promise<any> {
    return apiClient.post<any>(`/discussions/${id}/solve/`, {});
  },

  async getReplies(discussionId: number): Promise<Reply[]> {
    try {
      const response = await apiClient.get<Reply[] | { results: Reply[] }>('/replies/', { params: { discussion: discussionId } });
      
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      console.error('Неожиданный формат ответа API для ответов:', response);
      return [];
    } catch (err) {
      console.error('Ошибка при получении ответов:', err);
      return [];
    }
  },

  async createReply(data: {
    discussion: number;
    content: string;
  }): Promise<Reply> {
    return apiClient.post<Reply>('/replies/', data);
  },

  async likeReply(id: number): Promise<any> {
    return apiClient.post<any>(`/replies/${id}/like/`, {});
  }
}; 