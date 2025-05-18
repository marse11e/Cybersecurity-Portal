import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Calendar, 
  Clock, 
  ChevronRight,
  BookOpen,
  Zap,
  FileText,
  BarChart2,
  MessageSquare,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { articleService } from '../api/services/article.service';
import { Article, Category } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Безопасно получаем уникальные категории из статей и преобразуем их в строки
  const categories = ['All Categories'];
  if (Array.isArray(articles)) {
    const uniqueCategories = new Set();
    articles.forEach(article => {
      if (article.category) {
        // Если категория - это объект, берем name, иначе используем как есть
        const categoryName = typeof article.category === 'object' && article.category !== null
          ? (article.category as Category).name
          : article.category;
        uniqueCategories.add(categoryName);
      }
    });
    categories.push(...Array.from(uniqueCategories) as string[]);
  }
  
  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, sortBy]);
  
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (selectedCategory !== 'All Categories') params.category = String(selectedCategory);
      if (searchTerm) params.search = searchTerm;
      if (sortBy === 'newest') params.ordering = '-date';
      if (sortBy === 'oldest') params.ordering = 'date';
      if (sortBy === 'popular') params.ordering = '-views';
      if (sortBy === 'comments') params.ordering = '-comments';
      
      const data = await articleService.getArticles(params);
      // Проверяем, что данные - это массив
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        console.error('API вернул неверный формат данных:', data);
        setArticles([]);
        setError('Ошибка формата данных от API');
      }
    } catch (err: any) {
      console.error('Ошибка загрузки статей:', err);
      setArticles([]);
      setError('Ошибка загрузки статей');
    } finally {
      setLoading(false);
    }
  };
  
  // Получаем название категории (строку) из объекта категории, строки или числа
  const getCategoryName = (category: string | number | Category | null | undefined): string => {
    if (!category) return '';
    if (typeof category === 'object') return category.name;
    return String(category);
  };
  
  // Featured articles - с проверкой на массив
  const featuredArticles = Array.isArray(articles) ? articles.filter(article => (article as any).featured) : [];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Hero Section */}
      <section className="bg-[#222222] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Кибербезопасность: статьи и аналитика</h1>
            <p className="text-xl text-gray-300 mb-6">
              Будьте в курсе последних новостей, трендов и экспертного анализа от профессионалов индустрии.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск статей..."
                className="w-full px-4 py-3 pl-12 rounded-lg bg-[#333333] border border-[#444444] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 space-y-6">
              {/* Categories - Desktop */}
              <div className="hidden md:block bg-[#222222] rounded-lg border border-[#333333] p-6">
                <h3 className="text-lg font-bold mb-4 text-white">Категории</h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${index}`}
                        name="category"
                        className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-[#444444] rounded bg-[#333333]"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                      <label htmlFor={`category-${index}`} className="ml-2 text-sm text-gray-300">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-[#444444] my-4 pt-4">
                  <h3 className="text-lg font-bold mb-4 text-white">Популярные теги</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#444444] hover:text-[#ffcc00] cursor-pointer transition-colors">
                      ransomware
                    </span>
                    <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#444444] hover:text-[#ffcc00] cursor-pointer transition-colors">
                      zero trust
                    </span>
                    <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#444444] hover:text-[#ffcc00] cursor-pointer transition-colors">
                      AI
                    </span>
                    <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#444444] hover:text-[#ffcc00] cursor-pointer transition-colors">
                      cloud security
                    </span>
                    <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#444444] hover:text-[#ffcc00] cursor-pointer transition-colors">
                      phishing
                    </span>
                    <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#444444] hover:text-[#ffcc00] cursor-pointer transition-colors">
                      compliance
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-[#444444] my-4 pt-4">
                  <h3 className="text-lg font-bold mb-4 text-white">Подписка</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Получайте новые статьи на вашу почту.
                  </p>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Ваш email"
                      className="w-full px-3 py-2 border border-[#444444] bg-[#333333] rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
                    />
                    <button className="w-full bg-[#ffcc00] hover:bg-[#ffd633] text-black py-2 px-4 rounded-md transition-colors duration-200">
                      Подписаться
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile Filters Toggle */}
              <div className="md:hidden mb-6">
                <button 
                  className="w-full flex items-center justify-between bg-[#222222] rounded-lg border border-[#333333] p-4"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 text-white mr-2" />
                    <span className="font-medium text-white">Фильтры</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-white transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Mobile Filters Panel */}
                {showFilters && (
                  <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mt-2">
                    <h3 className="text-lg font-bold mb-4 text-white">Категории</h3>
                    <div className="space-y-2 mb-4">
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            id={`mobile-category-${index}`}
                            name="mobile-category"
                            className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-[#444444] bg-[#333333] rounded"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                          />
                          <label htmlFor={`mobile-category-${index}`} className="ml-2 text-sm text-gray-300">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-4 text-white">Популярные теги</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm">
                        ransomware
                      </span>
                      <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm">
                        zero trust
                      </span>
                      <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm">
                        AI
                      </span>
                      <span className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm">
                        cloud security
                      </span>
                    </div>
                    
                    <button 
                      className="w-full bg-[#ffcc00] hover:bg-[#ffd633] text-black py-2 rounded-md transition-colors duration-200"
                      onClick={() => setShowFilters(false)}
                    >
                      Применить фильтры
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Articles List */}
            <div className="flex-1">
              {/* Sort Options */}
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-4 mb-6 flex flex-wrap items-center justify-between">
                <div className="text-sm text-gray-400 mb-2 md:mb-0">
                  {loading ? 'Загрузка статей...' : `Показано `}
                  <span className="font-medium text-white">{articles.length}</span> статей
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-300 mr-2">Сортировать:</span>
                  <select 
                    className="form-input py-1 px-2 text-sm border-[#444444] rounded-md bg-[#333333] text-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Сначала новые</option>
                    <option value="oldest">Сначала старые</option>
                    <option value="popular">Популярные</option>
                    <option value="comments">По комментариям</option>
                  </select>
                </div>
              </div>
              
              {/* Ошибка */}
              {error && (
                <div className="text-center py-8">
                  <ErrorDisplay error={error} retryFn={fetchArticles} />
                </div>
              )}
              
              {/* Featured Articles */}
              {selectedCategory === 'All Categories' && searchTerm === '' && featuredArticles.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-white">Избранные статьи</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {featuredArticles.map((article) => (
                      <FeaturedArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Article Categories */}
              {selectedCategory === 'All Categories' && searchTerm === '' && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-white">Категории статей</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CategoryCard 
                      title="Основы кибербезопасности" 
                      icon={<BookOpen className="h-8 w-8 text-[#ffcc00]" />}
                      count={Array.isArray(articles) ? articles.filter(a => getCategoryName(a.category) === 'Cybersecurity Basics').length : 0}
                      onClick={() => setSelectedCategory('Cybersecurity Basics')}
                    />
                    <CategoryCard 
                      title="Продвинутые техники" 
                      icon={<Zap className="h-8 w-8 text-[#ffcc00]" />}
                      count={Array.isArray(articles) ? articles.filter(a => getCategoryName(a.category) === 'Advanced Techniques').length : 0}
                      onClick={() => setSelectedCategory('Advanced Techniques')}
                    />
                    <CategoryCard 
                      title="Кейс-стади" 
                      icon={<FileText className="h-8 w-8 text-[#ffcc00]" />}
                      count={Array.isArray(articles) ? articles.filter(a => getCategoryName(a.category) === 'Case Studies').length : 0}
                      onClick={() => setSelectedCategory('Case Studies')}
                    />
                    <CategoryCard 
                      title="Угрозы и аналитика" 
                      icon={<BarChart2 className="h-8 w-8 text-[#ffcc00]" />}
                      count={Array.isArray(articles) ? articles.filter(a => getCategoryName(a.category) === 'Threat Intelligence').length : 0}
                      onClick={() => setSelectedCategory('Threat Intelligence')}
                    />
                  </div>
                </div>
              )}
              
              {/* All Articles */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">
                  {selectedCategory !== 'All Categories' 
                    ? selectedCategory 
                    : searchTerm 
                      ? `Результаты поиска для "${searchTerm}"`
                      : "Последние статьи"}
                </h2>
                
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <LoadingSpinner size="large" text="Загрузка статей..." />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <ErrorDisplay error={error} retryFn={fetchArticles} />
                  </div>
                ) : Array.isArray(articles) && articles.length === 0 ? (
                  <div className="bg-[#222222] rounded-lg border border-[#333333] p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">Статьи не найдены</h3>
                    <p className="text-gray-400 mb-4">
                      Мы не смогли найти статьи по вашему запросу. Попробуйте изменить параметры поиска или фильтры.
                    </p>
                    <button 
                      className="px-4 py-2 border border-[#444444] text-gray-300 rounded-md hover:bg-[#333333] transition-colors"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All Categories');
                      }}
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(articles) && articles.map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button className="px-3 py-2 rounded-md border border-[#444444] text-gray-300 hover:bg-[#333333]">
                      Предыдущая
                    </button>
                    <button className="px-3 py-2 rounded-md bg-[#ffcc00] text-black">1</button>
                    <button className="px-3 py-2 rounded-md border border-[#444444] text-gray-300 hover:bg-[#333333]">2</button>
                    <button className="px-3 py-2 rounded-md border border-[#444444] text-gray-300 hover:bg-[#333333]">3</button>
                    <span className="px-3 py-2 text-gray-500">...</span>
                    <button className="px-3 py-2 rounded-md border border-[#444444] text-gray-300 hover:bg-[#333333]">8</button>
                    <button className="px-3 py-2 rounded-md border border-[#444444] text-gray-300 hover:bg-[#333333]">
                      Следующая
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-[#222222] border-t border-[#333333] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Будьте в курсе последних новостей</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Подпишитесь на нашу рассылку, чтобы получать новые статьи, обзоры и обновления прямо на вашу почту.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 px-4 py-3 rounded-lg bg-[#333333] border border-[#444444] text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
            />
            <button className="bg-[#ffcc00] hover:bg-[#ffd633] text-black px-6 py-3 rounded-lg transition-colors duration-200">
              Подписаться
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Featured Article Card Component
const FeaturedArticleCard: React.FC<{ article: any }> = ({ article }) => {
  const categoryName = typeof article.category === 'object' && article.category !== null
    ? (article.category as Category).name
    : article.category;
  
  return (
    <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden flex flex-col md:flex-row hover:border-[#ffcc00] transition-colors duration-300">
      <div className="md:w-1/2">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 md:w-1/2">
        <div className="flex items-center mb-2">
          <span className="px-3 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-xs font-medium">{categoryName}</span>
          <span className="text-sm text-gray-400 ml-2">{article.date}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-white">{article.title}</h3>
        <p className="text-gray-400 mb-4">{article.description}</p>
        <div className="flex items-center mb-4">
          <img 
            src={article.author.image} 
            alt={article.author.name} 
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-300">{article.author.name}</span>
          <span className="mx-2 text-gray-500">•</span>
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>{article.readTime} мин. чтения</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{article.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{article.comments}</span>
            </div>
          </div>
          <Link to={`/articles/${article.id}`} className="px-4 py-2 bg-[#ffcc00] hover:bg-[#ffd633] text-black rounded-md font-medium transition-colors">
            Читать статью
          </Link>
        </div>
      </div>
    </div>
  );
};

// Article Card Component
const ArticleCard: React.FC<{ article: any }> = ({ article }) => {
  const categoryName = typeof article.category === 'object' && article.category !== null
    ? (article.category as Category).name
    : article.category;
    
  return (
    <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden hover:border-[#ffcc00] transition-all duration-300">
      <div className="relative">
        <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
        <div className="absolute top-0 right-0 m-2">
          <span className="px-3 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-xs font-medium">{categoryName}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{article.date}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>{article.readTime} мин. чтения</span>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">{article.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.description}</p>
        <div className="flex items-center mb-4">
          <img 
            src={article.author.image} 
            alt={article.author.name} 
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-300">{article.author.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{article.comments}</span>
            </div>
          </div>
          <Link to={`/articles/${article.id}`} className="text-[#ffcc00] hover:text-[#ffd633] font-medium text-sm flex items-center">
            Читать далее <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode;
  count: number;
  onClick: () => void;
}> = ({ title, icon, count, onClick }) => (
  <div 
    className="bg-[#222222] rounded-lg border border-[#333333] p-6 hover:border-[#ffcc00] transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-full bg-[#333333]">{icon}</div>
      <span className="px-3 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-xs font-medium">{count} статей</span>
    </div>
    <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
    <button className="text-[#ffcc00] hover:text-[#ffd633] font-medium flex items-center text-sm">
      Смотреть статьи <ChevronRight className="h-4 w-4 ml-1" />
    </button>
  </div>
);

export default ArticlesPage;