// Общие типы
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  date_joined?: string;
  image?: string;
  courses_completed?: number;
  tests_completed?: number;
  articles_read?: number;
  average_score?: number;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// Типы для категорий и тегов
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  subcategories?: Category[];
  count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Типы для достижений
export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface UserAchievement {
  id: number;
  title: string;
  description: string;
  date?: string;
  unlocked: boolean;
}

export interface UserActivity {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'course' | 'test' | 'article' | 'achievement';
}

// Типы для тестов
export interface Test {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  level: string;
  duration: number;
  questions_count: number;
  participants: number;
  rating: number;
  featured: boolean;
  tags: string[];
  passing_score: number;
  image?: string;
}

export interface TestQuestion {
  id: number;
  test: number;
  question_text: string;
  options: string[];
  order: number;
  topic?: string;
  difficulty?: string;
}

export interface TestAttempt {
  id: number;
  test: number;
  user: number;
  start_time: string;
  end_time?: string;
  completed: boolean;
  score?: number;
  answers?: TestAnswer[];
}

export interface TestAnswer {
  question_id: number;
  selected_option: string;
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
}

export interface TestResult {
  id: number;
  test: number;
  user: number;
  attempt: number;
  total_questions: number;
  correct_answers: number;
  score_percent: number;
  passed: boolean;
  time_spent: number;
  detailed_results: TestAnswer[];
  created_at: string;
}

// Типы для курсов
export interface Course {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  category: string;
  level: string;
  duration: number;
  students: number;
  rating: number;
  featured: boolean;
  tags: string[];
  instructor: {
    id: number;
    name: string;
    image?: string;
  };
  certificate: boolean;
  last_updated: string;
  image?: string;
  language?: string;
  price?: string;
}

// Типы для статей
export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string | Category;
  author: User;
  featured: boolean;
  tags: string[];
  views: number;
  likes: number;
  date: string;
  image?: string;
  comments_count: number;
}

// Типы для форума
export interface Discussion {
  id: number;
  title: string;
  description: string;
  category: string;
  author: User;
  tags: string[];
  pinned: boolean;
  solved: boolean;
  views: number;
  likes: number;
  replies: number;
  date: string;
}

export interface Reply {
  id: number;
  discussion: number;
  user: User;
  content: string;
  likes: number;
  date: string;
}