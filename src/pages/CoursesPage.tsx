import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Filter, 
  Search, 
  ChevronDown, 
  Clock, 
  Users, 
  Star,
  Shield,
  Server,
  Building,
  ChevronRight,
  Award,
  Globe
} from 'lucide-react';
import { courseService } from '../api/services/course.service';
import { Course } from '../api/types';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedLevel, setSelectedLevel] = useState('Все уровни');
  const [sortBy, setSortBy] = useState('популярность');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Все категории']);
  const [levels, setLevels] = useState<string[]>(['Все уровни']);
  
  // Универсальная функция для получения имени категории
  const getCategoryName = (category: string | number | any | null | undefined): string => {
    if (!category) return '';
    if (typeof category === 'object') return category.name;
    return String(category);
  };

  // Универсальная функция для получения уровня
  const getLevelName = (level: string | any | null | undefined): string => {
    if (!level) return '';
    if (typeof level === 'object') return level.name || '';
    return String(level);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {};
        if (selectedCategory !== 'Все категории') params.category = selectedCategory;
        if (selectedLevel !== 'Все уровни') params.level = selectedLevel;
        if (searchTerm) params.search = searchTerm;
        if (sortBy === 'рейтинг') params.ordering = '-rating';
        if (sortBy === 'новые') params.ordering = '-last_updated';
        const data = await courseService.getCourses(params);
        setCourses(Array.isArray(data) ? data : []);
        // Извлекаем уникальные категории и уровни как строки
        if (Array.isArray(data) && data.length > 0) {
          const uniqueCategories = ['Все категории', ...new Set(data.map(course => getCategoryName(course.category)))];
          const uniqueLevels = ['Все уровни', ...new Set(data.map(course => getLevelName(course.level)))];
          setCategories(uniqueCategories);
          setLevels(uniqueLevels);
        } else {
          setCategories(['Все категории']);
          setLevels(['Все уровни']);
        }
      } catch (err: any) {
        setError('Ошибка загрузки курсов: ' + (err.message || JSON.stringify(err)));
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel, sortBy]);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Заголовок */}
      <section className="bg-[#222222] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Каталог курсов</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Выберите один из наших экспертных курсов и начните развивать свои навыки в области кибербезопасности
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Поиск и фильтры */}
          <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="w-full md:w-auto relative">
                <input
                  type="search"
                  placeholder="Поиск курсов..."
                  className="pl-10 pr-4 py-3 bg-[#333333] border border-[#444444] text-white rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <button 
                className="flex items-center space-x-2 bg-[#333333] border border-[#444444] hover:border-[#ffcc00] text-white px-4 py-3 rounded-lg w-full md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
                <span>Фильтры</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#444444]">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Категория</label>
                  <select 
                    className="w-full p-3 bg-[#333333] border border-[#444444] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Уровень</label>
                  <select 
                    className="w-full p-3 bg-[#333333] border border-[#444444] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Сортировать по</label>
                  <select 
                    className="w-full p-3 bg-[#333333] border border-[#444444] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="популярность">Популярность</option>
                    <option value="рейтинг">Рейтинг</option>
                    <option value="новые">Новые</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Ошибка */}
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>
          )}

          {/* Результаты */}
          <div className="mb-4 text-gray-300">
            {loading ? "Загрузка курсов..." : `Найдено ${Array.isArray(courses) ? courses.length : 0} курсов`}
          </div>

          {/* Сетка курсов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Показываем индикаторы загрузки
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                  <div className="animate-pulse">
                    <div className="h-48 bg-[#333333] rounded mb-4"></div>
                    <div className="h-6 bg-[#333333] rounded mb-2"></div>
                    <div className="h-4 bg-[#333333] rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-[#333333] rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-[#333333] rounded mb-4 w-2/3"></div>
                    <div className="h-10 bg-[#333333] rounded"></div>
                  </div>
                </div>
              ))
            ) : Array.isArray(courses) ? courses.map(course => (
              <CourseCard key={course.id} course={course} />
            )) : <div className="text-white">Ошибка загрузки данных</div>}
          </div>

          {/* Если курсов нет */}
          {!loading && Array.isArray(courses) && courses.length === 0 && (
            <div className="text-center py-16 bg-[#222222] rounded-lg border border-[#333333]">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Курсы не найдены</h3>
              <p className="text-gray-400">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-16 bg-[#222222] border-t border-[#333333]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Не нашли подходящий курс?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Подпишитесь на нашу рассылку, чтобы первыми узнавать о новых курсах и получить персональные рекомендации
          </p>
          <div className="flex flex-col md:flex-row max-w-lg mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Ваш email" 
              className="flex-1 p-3 bg-[#333333] border border-[#444444] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" 
            />
            <button className="bg-[#ffcc00] text-black font-medium hover:bg-[#ffd633] px-6 py-3 rounded-lg transition-colors">
              Подписаться
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Обновляем компонент карточки курса
const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden hover:border-[#ffcc00] transition-all duration-300">
    {course.image && (
      <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
    )}
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-white">{course.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
      
      <div className="flex items-center mb-3 gap-2">
        {course.instructor && typeof course.instructor === 'object' && (
          <div className="flex items-center">
            <img 
              src={course.instructor.image || ''} 
              alt={course.instructor.name} 
              className="w-6 h-6 rounded-full mr-2 object-cover"
            />
            <span className="text-sm text-gray-300">{course.instructor.name}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center text-sm text-gray-400 mb-4 gap-3">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-500" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1 text-gray-500" />
          <span>{course.students.toLocaleString()} студентов</span>
        </div>
        {course.language && (
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-1 text-gray-500" />
            <span>{course.language}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-300">{course.rating}</span>
        </div>
        <span className="text-xs px-2 py-1 bg-[#333333] text-[#ffcc00] rounded-full">{course.level}</span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        {course.price && (
          <div className="font-bold text-lg text-white">{course.price}</div>
        )}
        {course.certificate && (
          <div className="flex items-center text-xs text-gray-300">
            <Award className="h-4 w-4 mr-1 text-[#ffcc00]" />
            <span>Сертификат</span>
          </div>
        )}
      </div>
      
      <Link 
        to={`/courses/${course.id}`} 
        className="block w-full bg-[#ffcc00] hover:bg-[#ffd633] text-black text-center py-2 px-4 rounded-lg transition-colors"
      >
        Подробнее
      </Link>
    </div>
  </div>
);

export default CoursesPage;