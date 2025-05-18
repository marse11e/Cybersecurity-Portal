import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../store';
import { logout } from '../store/userSlice';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Интерсептор для токена
    this.client.interceptors.request.use((config) => {
      // Получаем токен из Redux store, если есть
      const state = store.getState();
      const token = state.user?.access || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Интерсептор для обработки ответов и ошибок
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Логируем успешные ответы если нужно для отладки
        console.debug('API ответ:', response.config.url, response.status);
        return response;
      },
      (error) => {
        if (error.response) {
          // Логируем детали ошибки
          console.error('API ошибка:', error.config.url, error.response.status, error.response.data);
          
          // Обработка конкретных кодов ошибок
          if (error.response.status === 401) {
            store.dispatch(logout());
          }
        } else if (error.request) {
          // Запрос отправлен, но нет ответа (например, нет соединения)
          console.error('Ошибка соединения:', error.request);
        } else {
          // Ошибка при настройке запроса
          console.error('Ошибка настройки запроса:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`GET ${url} ошибка:`, error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} ошибка:`, error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} ошибка:`, error);
      throw error;
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PATCH ${url} ошибка:`, error);
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} ошибка:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient(); 