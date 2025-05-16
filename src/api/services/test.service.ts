import { apiClient } from '../client';
import { Test, TestQuestion, TestResult } from '../types';

export const testService = {
  async getTests(params?: {
    category?: string;
    level?: string;
    featured?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<Test[]> {
    return apiClient.get<Test[]>('/tests/', { params });
  },

  async getTest(id: number): Promise<Test> {
    return apiClient.get<Test>(`/tests/${id}/`);
  },

  async getTestQuestions(testId: number): Promise<TestQuestion[]> {
    return apiClient.get<TestQuestion[]>(`/tests/${testId}/questions/`);
  },

  async submitTestAnswers(testId: number, answers: {
    question_id: number;
    selected_option: string;
  }[]): Promise<TestResult> {
    return apiClient.post<TestResult>(`/tests/${testId}/submit_answers/`, { answers });
  },

  async getTestResults(testId: number): Promise<TestResult[]> {
    return apiClient.get<TestResult[]>(`/tests/${testId}/results/`);
  },
  
  async getFeaturedTests(): Promise<Test[]> {
    return apiClient.get<Test[]>('/tests/featured/');
  },
}; 