// Общие типы
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  bio?: string;
  avatar?: string | null;
  image?: string | null;
  join_date?: string;
  date_joined?: string;
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
  user: User;
  achievement: Achievement;
  date_earned?: string;
  unlocked: boolean;
  date?: string;
}

export interface UserActivity {
  id: number;
  user: User;
  activity_type: 'course' | 'test' | 'article' | 'discussion' | 'achievement';
  title: string;
  date: string;
  progress?: number;
  score?: number;
  description: string;
}

// Типы для тестов
export interface Test {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  image?: string;
  category: Category | number | string | null;
  level: string;
  duration: string;
  questions_count: number;
  participants: number;
  rating: number;
  featured: boolean;
  tags: (Tag | number | string)[];
  passing_score: number;
  max_attempts: number;
  created_at?: string;
  updated_at?: string;
}

export interface TestQuestion {
  id: number;
  test: number;
  topic?: string;
  question_text: string;
  question_type?: string;
  options: string[];
  correct_answer?: string | string[];
  explanation?: string;
  difficulty?: number;
  points?: number;
  order: number;
}

export interface TestAttempt {
  id: number;
  user: User;
  test: number;
  start_time: string;
  end_time?: string;
  status?: string;
  score?: number;
  answers?: any;
  attempt_number?: number;
}

export interface TestResult {
  id: number;
  attempt: TestAttempt;
  total_questions: number;
  correct_answers: number;
  score_percent: number;
  time_spent: number;
  passed: boolean;
  feedback?: string;
  detailed_results: any;
  created_at: string;
}

// Типы для курсов
export interface Course {
  id: number;
  title: string;
  description: string;
  long_description?: string;
  image?: string;
  category: Category | number | string | null;
  level: string;
  duration: string;
  instructor: User;
  rating: number;
  students: number;
  price?: string;
  featured: boolean;
  tags: (Tag | number | string)[];
  last_updated: string;
  language?: string;
  certificate: boolean;
  prerequisites?: string;
  objectives?: string[];
}

// Типы для статей
export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  image?: string;
  category: Category | number | string | null;
  date: string;
  author: User;
  read_time?: number;
  tags: (Tag | number | string)[];
  views: number;
  likes: number;
  featured: boolean;
  comments_count: number;
}

// Типы для форума
export interface Discussion {
  id: number;
  title: string;
  description: string;
  category: Category | number | string | null;
  author: User;
  date: string;
  replies: number;
  views: number;
  likes: number;
  tags: (Tag | number | string)[];
  pinned: boolean;
  solved: boolean;
}

export interface Reply {
  id: number;
  discussion: number;
  user: User;
  content: string;
  date: string;
  likes: number;
}

export interface CourseSection {
  id: number;
  course: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  section: number;
  title: string;
  duration: string;
  type: string;
  order: number;
}

export interface CourseMaterial {
  id: number;
  course: number;
  title: string;
  file: string;
  type: string;
  size: string;
}

export interface CourseReview {
  id: number;
  course: number;
  user: User;
  rating: number;
  date: string;
  comment: string;
}

export interface CourseProgress {
  id?: number;
  user?: User;
  lesson?: Lesson;
  lesson_id?: number;
  completed?: boolean;
  date_completed?: string;
  course_id?: number;
  completed_lessons?: number;
  total_lessons?: number;
  progress_percentage?: number;
}