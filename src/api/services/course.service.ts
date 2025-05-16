import { apiClient } from '../client';
import { Course } from '../types';

// Типы для секций и материалов курса
interface CourseSection {
  id: number;
  course: number;
  title: string;
  order: number;
  lessons: any[];
}

interface CourseMaterial {
  id: number;
  course: number;
  title: string;
  file: string;
  type: string;
  size: string;
}

interface CourseReview {
  id: number;
  course: number;
  user: any;
  rating: number;
  date: string;
  comment: string;
}

interface CourseProgress {
  course_id: number;
  completed_lessons: number;
  total_lessons: number;
  progress_percentage: number;
}

export const courseService = {
  async getCourses(params?: {
    category?: string;
    level?: string;
    featured?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<Course[]> {
    try {
      const response = await apiClient.get<Course[] | { results: Course[] }>('/courses/', { params });
      
      // Проверяем, является ли ответ объектом с полем results (пагинированный ответ)
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      // Если ответ - массив, возвращаем его
      if (Array.isArray(response)) {
        return response;
      }
      
      console.error('Неожиданный формат ответа API для курсов:', response);
      return [];
    } catch (error) {
      console.error('Ошибка при получении курсов:', error);
      return [];
    }
  },

  async getCourse(id: number): Promise<Course> {
    return apiClient.get<Course>(`/courses/${id}/`);
  },

  async getCourseSections(courseId: number): Promise<CourseSection[]> {
    try {
      const response = await apiClient.get<CourseSection[] | { results: CourseSection[] }>(`/courses/${courseId}/sections/`);
      
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error(`Ошибка при получении разделов курса ${courseId}:`, error);
      return [];
    }
  },

  async getCourseMaterials(courseId: number): Promise<CourseMaterial[]> {
    try {
      const response = await apiClient.get<CourseMaterial[] | { results: CourseMaterial[] }>(`/courses/${courseId}/materials/`);
      
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error(`Ошибка при получении материалов курса ${courseId}:`, error);
      return [];
    }
  },

  async getCourseReviews(courseId: number): Promise<CourseReview[]> {
    try {
      const response = await apiClient.get<CourseReview[] | { results: CourseReview[] }>(`/courses/${courseId}/reviews/`);
      
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error(`Ошибка при получении отзывов курса ${courseId}:`, error);
      return [];
    }
  },

  async addCourseReview(courseId: number, data: {
    rating: number;
    comment: string;
  }): Promise<CourseReview> {
    return apiClient.post<CourseReview>(`/course-reviews/`, {
      course: courseId,
      rating: data.rating,
      comment: data.comment
    });
  },

  async updateLessonProgress(lessonId: number, completed: boolean): Promise<any> {
    return apiClient.post<any>(`/course-progress/`, {
      lesson: lessonId,
      completed
    });
  },

  async getCourseProgress(courseId: number): Promise<CourseProgress> {
    return apiClient.get<CourseProgress>(`/course-progress/by_course/?course=${courseId}`);
  },
  
  async getFeaturedCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<Course[] | { results: Course[] }>('/courses/featured/');
      
      if (response && typeof response === 'object' && 'results' in response) {
        return response.results;
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error('Ошибка при получении избранных курсов:', error);
      return [];
    }
  }
}; 