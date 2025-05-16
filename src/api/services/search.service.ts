import { apiClient } from '../client';
import { Article, Course, Discussion, Test } from '../types';

export interface SearchResults {
  articles: Article[];
  courses: Course[];
  discussions: Discussion[];
  tests: Test[];
}

export const searchService = {
  async search(query: string): Promise<SearchResults> {
    return apiClient.get<SearchResults>('/search/', { params: { q: query } });
  },
};
