import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  MessageSquare, 
  Clock,
  Eye,
  ChevronRight,
  ThumbsUp,
  Plus
} from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { discussionService } from '../api/services/discussion.service';
import { categoryService } from '../api/services/category.service';
import { Discussion, Category } from '../api/types';

// Mock data for forum discussions
const discussionsData = [
  {
    id: 1,
    title: "Как защитить сеть от DDoS атак?",
    description: "Ищу рекомендации по настройке защиты от DDoS атак для небольшой компании...",
    category: "Безопасность сетей",
    author: {
      name: "Александр П.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "Security Architect"
    },
    date: "2 часа назад",
    replies: 12,
    views: 234,
    likes: 18,
    tags: ["ddos", "security", "network"],
    pinned: true,
    solved: true
  },
  {
    id: 2,
    title: "Анализ уязвимости Log4j и стратегии защиты",
    description: "Обсудим уязвимость Log4j, её влияние и эффективные стратегии защиты помимо патчей.",
    category: "Уязвимости",
    author: {
      name: "Сара Иванова",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      role: "Исследователь безопасности"
    },
    date: "14 мая 2025",
    replies: 36,
    views: 587,
    likes: 42,
    tags: ["log4j", "уязвимость", "защита"],
    pinned: true,
    solved: true
  },
  {
    id: 3,
    title: "Рекомендации по программам обучения фишинговой безопасности",
    description: "Какие программы или подходы обучения фишинговой безопасности оказались наиболее эффективными в ваших организациях?",
    category: "Обучение безопасности",
    author: {
      name: "Елена Петрова",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      role: "Менеджер по обучению безопасности"
    },
    date: "12 мая 2025",
    replies: 19,
    views: 276,
    likes: 15,
    tags: ["фишинг", "обучение", "осведомленность"],
    pinned: false,
    solved: true
  },
  {
    id: 4,
    title: "Securing containerized applications in Kubernetes",
    description: "Looking for best practices and tools for securing containerized applications running in Kubernetes environments.",
    category: "Cloud Security",
    author: {
      name: "David Wilson",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      role: "DevSecOps Engineer"
    },
    date: "May 10, 2025",
    replies: 28,
    views: 412,
    likes: 23,
    tags: ["kubernetes", "containers", "devsecops"],
    pinned: false,
    solved: false
  },
  {
    id: 5,
    title: "GDPR compliance challenges for multinational organizations",
    description: "What challenges have you faced implementing GDPR compliance across multiple countries, and how did you address them?",
    category: "Compliance",
    author: {
      name: "Jennifer Lee",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      role: "Compliance Officer"
    },
    date: "May 8, 2025",
    replies: 15,
    views: 198,
    likes: 9,
    tags: ["gdpr", "compliance", "privacy"],
    pinned: false,
    solved: false
  },
  {
    id: 6,
    title: "Effective SOC metrics and KPIs",
    description: "What metrics and KPIs have you found most valuable for measuring SOC effectiveness and demonstrating value to leadership?",
    category: "Security Operations",
    author: {
      name: "Robert Davis",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      role: "SOC Manager"
    },
    date: "May 6, 2025",
    replies: 22,
    views: 287,
    likes: 17,
    tags: ["soc", "metrics", "kpi"],
    pinned: false,
    solved: true
  },
  {
    id: 7,
    title: "Внедрение беспарольной аутентификации",
    description: "Кто-нибудь успешно внедрил беспарольную аутентификацию в своей организации? Ищу реальный опыт и извлеченные уроки.",
    category: "Идентификация и доступ",
    author: {
      name: "Тимур Волков",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      role: "Специалист по IAM"
    },
    date: "5 мая 2025",
    replies: 31,
    views: 342,
    likes: 28,
    tags: ["аутентификация", "безопасность", "доступ"],
    pinned: false,
    solved: false
  },
  {
    id: 8,
    title: "Методы поиска угроз для обнаружения APT",
    description: "Какие методы и инструменты поиска угроз вы считаете эффективными для обнаружения продвинутых постоянных угроз (APT)?",
    category: "Поиск угроз",
    author: {
      name: "Алексей Родионов",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      role: "Специалист по угрозам"
    },
    date: "3 мая 2025",
    replies: 18,
    views: 245,
    likes: 14,
    tags: ["поиск угроз", "apt", "обнаружение"],
    pinned: false,
    solved: false
  },
  {
    id: 9,
    title: "Защита IoT устройств в корпоративной среде",
    description: "Как вы решаете проблемы безопасности, связанные с IoT устройствами в вашей корпоративной среде?",
    category: "Безопасность IoT",
    author: {
      name: "Лиза Жукова",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      role: "Специалист по IoT безопасности"
    },
    date: "1 мая 2025",
    replies: 16,
    views: 198,
    likes: 11,
    tags: ["iot", "безопасность устройств", "сегментация сети"],
    pinned: false,
    solved: false
  }
];

// Mock data for categories
const categoriesData = [
  { name: "Архитектура безопасности", count: 45 },
  { name: "Уязвимости", count: 78 },
  { name: "Обучение безопасности", count: 32 },
  { name: "Облачная безопасность", count: 56 },
  { name: "Соответствие требованиям", count: 29 },
  { name: "Операции безопасности", count: 41 },
  { name: "Идентификация и доступ", count: 38 },
  { name: "Поиск угроз", count: 27 },
  { name: "Безопасность IoT", count: 19 }
];

// Mock data for popular tags
const popularTags = [
  { name: "ddos", count: 45 },
  { name: "файервол", count: 32 },
  { name: "ssl", count: 28 },
  { name: "шифрование", count: 25 },
  { name: "взлом", count: 20 },
  { name: "защита", count: 18 }
];

const ForumPage: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Запрос категорий');
        const categoriesData = await categoryService.getCategories();
        console.log('Полученные категории:', categoriesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        const params: any = {
          sort_by: sortBy,
        };

        if (activeCategory) {
          params.category = activeCategory;
        }

        if (searchTerm) {
          params.search = searchTerm;
        }

        console.log('Запрос обсуждений с параметрами:', params);
        const discussionsData = await discussionService.getDiscussions(params);
        console.log('Полученные обсуждения:', discussionsData);
        
        if (Array.isArray(discussionsData)) {
          setDiscussions(discussionsData);
        } else {
          console.warn('Данные обсуждений не являются массивом:', discussionsData);
          setDiscussions([]);
        }
      } catch (err) {
        console.error('Ошибка загрузки обсуждений:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [activeCategory, searchTerm, sortBy]);

  const toggleCategoryExpanded = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Поиск уже происходит в useEffect при изменении searchTerm
  };

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Форум</h1>
          <Link 
            to="/forum/new" 
            className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Новое обсуждение
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Боковая панель с категориями */}
          <div className="lg:col-span-1">
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Категории</h2>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleCategoryFilter(null)}
                    className={`w-full text-left py-2 px-3 rounded-md flex items-center ${activeCategory === null ? 'bg-[#333333] text-[#ffcc00]' : 'text-gray-300 hover:bg-[#2a2a2a]'}`}
                  >
                    Все категории
                  </button>
                </li>
                {Array.isArray(categories) ? categories.map((category, index) => (
                  <li key={index}>
                    <div className="flex flex-col">
                      <button 
                        onClick={() => handleCategoryFilter(category.id)}
                        className={`w-full text-left py-2 px-3 rounded-md flex items-center justify-between ${activeCategory === category.id ? 'bg-[#333333] text-[#ffcc00]' : 'text-gray-300 hover:bg-[#2a2a2a]'}`}
                      >
                        <span>{category.name}</span>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategoryExpanded(category.id);
                            }}
                            className="text-gray-400"
                          >
                            {expandedCategories.includes(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </button>
                      {expandedCategories.includes(category.id) && category.subcategories && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {category.subcategories.map(sub => (
                            <li key={sub.id}>
                              <button 
                                onClick={() => handleCategoryFilter(sub.id)}
                                className={`w-full text-left py-1 px-3 rounded-md ${activeCategory === sub.id ? 'bg-[#333333] text-[#ffcc00]' : 'text-gray-300 hover:bg-[#2a2a2a]'}`}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                )) : <div className="text-sm text-gray-300">Загрузка категорий...</div>}
              </ul>
            </div>
          </div>

          {/* Основное содержимое */}
          <div className="lg:col-span-3">
            {/* Поиск и фильтрация */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Поиск обсуждений..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 pl-10 rounded-md bg-[#333333] border border-[#444444] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                    />
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </form>
                <div className="flex-shrink-0">
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value)}
                      className="appearance-none cursor-pointer w-full md:w-48 p-3 pr-10 rounded-md bg-[#333333] border border-[#444444] text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                    >
                      <option value="newest">Самые новые</option>
                      <option value="popular">Популярные</option>
                      <option value="most_replies">Больше всего ответов</option>
                      <option value="unsolved">Нерешенные</option>
                    </select>
                    <Filter className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Список обсуждений */}
            <div className="bg-[#222222] rounded-lg border border-[#333333]">
              <div className="p-6 border-b border-[#333333]">
                <h2 className="text-xl font-bold text-white">
                  {activeCategory 
                    ? `Обсуждения в категории: ${categories.find(c => c.id === activeCategory)?.name || 'Выбранная категория'}`
                    : 'Все обсуждения'
                  }
                </h2>
              </div>
              
              {loading ? (
                <div className="p-6 text-center text-gray-400">
                  Загрузка обсуждений...
                </div>
              ) : discussions.length > 0 ? (
                <div className="divide-y divide-[#333333]">
                  {discussions.map(discussion => (
                    <Link to={`/discussion/${discussion.id}`} key={discussion.id} className="block p-6 hover:bg-[#2a2a2a] transition-colors">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#333333] text-[#ffcc00] px-2 py-1 rounded-full text-xs">
                              {discussion.category}
                            </span>
                            {discussion.solved && (
                              <span className="bg-[#333333] text-green-400 flex items-center px-2 py-1 rounded-full text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Решено
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">
                            {discussion.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {discussion.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-400">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{discussion.replies} ответов</span>
                            </div>
                            <div className="mx-2">•</div>
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{discussion.likes}</span>
                            </div>
                            <div className="mx-2">•</div>
                            <span>Обновлено {discussion.date}</span>
                          </div>
                        </div>
                        {discussion.author && (
                          <div className="flex-shrink-0 ml-4 flex flex-col items-center">
                            <img 
                              src={discussion.author.image || "https://via.placeholder.com/40"}
                              alt={discussion.author.first_name} 
                              className="w-10 h-10 rounded-full mb-1"
                            />
                            <span className="text-xs text-gray-400">{discussion.author.first_name}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400">
                  Обсуждения не найдены. Попробуйте изменить критерии поиска или создайте новое обсуждение.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Обновленный DiscussionCard с темной темой
const DiscussionCard: React.FC<{ discussion: any }> = ({ discussion }) => (
  <div className={`bg-[#222222] rounded-lg border border-[#333333] overflow-hidden hover:border-[#ffcc00] transition-all duration-300 ${discussion.pinned ? 'border-l-4 border-[#ffcc00]' : ''}`}>
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {discussion.pinned && (
              <span className="badge badge-blue flex items-center text-[#ffcc00]">
                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Закреплено
              </span>
            )}
            <span className="badge badge-green text-green-400">{discussion.category}</span>
            {discussion.solved && (
              <span className="badge badge-green flex items-center text-green-400">
                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Решено
              </span>
            )}
          </div>
          <Link to={`/forum/${discussion.id}`} className="text-xl font-bold text-white hover:text-[#ffcc00] transition-colors duration-200">
            {discussion.title}
          </Link>
          <p className="text-gray-400 mt-2 line-clamp-2">{discussion.description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {discussion.tags.map((tag: string, index: number) => (
          <span key={index} className="px-2 py-1 bg-[#333333] text-gray-300 rounded-full text-xs">
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <img 
            src={discussion.author.image} 
            alt={discussion.author.name} 
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="text-sm font-medium text-white">{discussion.author.name}</div>
            <div className="text-xs text-gray-400">{discussion.author.role}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{discussion.date}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{discussion.replies}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{discussion.views}</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{discussion.likes}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ForumPage;