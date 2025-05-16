import { apiClient } from '../client';
import { Tag } from '../types';

export const tagService = {
  async getTags(params?: {
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<Tag[]> {
    return apiClient.get<Tag[]>('/tags/', { params });
  },

  async getTag(id: number): Promise<Tag> {
    return apiClient.get<Tag>(`/tags/${id}/`);
  },
};
