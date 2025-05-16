import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Clock, 
  Star,
  ChevronRight,
  ClipboardList,
  Shield,
  Server,
  Award
} from 'lucide-react';

// Моковые данные для тестов
const testsData = [
  {
    id: 1,
    title: "Основы кибербезопасности",
    description: "Проверьте свои знания основных концепций кибербезопасности, включая идентификацию угроз и базовые стратегии защиты.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Базовая безопасность",
    level: "Начальный",
    duration: "30 мин",
    questions: 25,
    participants: 1243,
    rating: 4.8,
    featured: true,
    tags: ["основы", "безопасность", "тестирование"]
  },
  {
    id: 2,
    title: "Сетевая безопасность",
    description: "Тест на знание принципов сетевой безопасности, включая настройку файерволов и обнаружение вторжений.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Сетевая безопасность",
    level: "Продвинутый",
    duration: "45 мин",
    questions: 35,
    participants: 876,
    rating: 4.9,
    featured: true,
    tags: ["сети", "защита", "файервол"]
  },
  {
    id: 3,
    title: "Phishing Identification Challenge",
    description: "Test your ability to identify phishing attempts with this interactive challenge featuring real-world examples of malicious emails and websites.",
    image: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Threat Identification",
    level: "Intermediate",
    duration: "30 min",
    questions: 25,
    participants: 4231,
    rating: 4.7,
    featured: true,
    tags: ["phishing", "social engineering", "threat identification"]
  },
  {
    id: 4,
    title: "Cloud Security Assessment",
    description: "Evaluate your knowledge of cloud security principles, services, and best practices across major cloud platforms including AWS, Azure, and GCP.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Advanced Cybersecurity",
    level: "Advanced",
    duration: "60 min",
    questions: 60,
    participants: 1543,
    rating: 4.6,
    featured: false,
    tags: ["cloud", "aws", "azure", "gcp"]
  },
  {
    id: 5,
    title: "Security Compliance Quiz",
    description: "Test your understanding of key security compliance frameworks including GDPR, HIPAA, PCI DSS, and SOC 2 with this comprehensive quiz.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Compliance",
    level: "Intermediate",
    duration: "40 min",
    questions: 40,
    participants: 2187,
    rating: 4.5,
    featured: false,
    tags: ["compliance", "regulations", "gdpr", "hipaa"]
  },
  {
    id: 6,
    title: "Incident Response Scenario Test",
    description: "Evaluate your incident response skills with realistic scenarios that test your ability to detect, analyze, and respond to security incidents.",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Incident Response",
    level: "Advanced",
    duration: "75 min",
    questions: 30,
    participants: 1298,
    rating: 4.8,
    featured: false,
    tags: ["incident response", "forensics", "security operations"]
  },
  {
    id: 7,
    title: "Secure Coding Practices Test",
    description: "Test your knowledge of secure coding practices, common vulnerabilities, and code security testing techniques across multiple programming languages.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Application Security",
    level: "Intermediate",
    duration: "60 min",
    questions: 55,
    participants: 1876,
    rating: 4.7,
    featured: false,
    tags: ["secure coding", "application security", "vulnerabilities"]
  },
  {
    id: 8,
    title: "IoT Security Assessment",
    description: "Evaluate your understanding of IoT security challenges, vulnerabilities, and protection strategies for connected devices and systems.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "IoT Security",
    level: "Intermediate",
    duration: "50 min",
    questions: 45,
    participants: 987,
    rating: 4.5,
    featured: false,
    tags: ["iot", "connected devices", "embedded systems"]
  },
  {
    id: 9,
    title: "Security Awareness Quiz",
    description: "Test your general security awareness knowledge with this quiz covering common threats, safe online practices, and basic security concepts.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Basic Cybersecurity",
    level: "Beginner",
    duration: "20 min",
    questions: 30,
    participants: 5432,
    rating: 4.6,
    featured: false,
    tags: ["awareness", "basics", "best practices"]
  }
];

const TestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique categories
  const categories = ['All Categories', ...new Set(testsData.map(test => test.category))];
  
  // Get unique levels
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
  
  // Filter and sort tests
  const filteredTests = testsData.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || test.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || test.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    if (sortBy === 'popularity') return b.participants - a.participants;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'questions-asc') return a.questions - b.questions;
    if (sortBy === 'questions-desc') return b.questions - a.questions;
    return 0;
  });
  
  // Get featured tests
  const featuredTests = testsData.filter(test => test.featured);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Hero Section */}
      <section className="bg-[#222222] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Тесты по кибербезопасности</h1>
            <p className="text-xl text-gray-300 mb-6">
              Проверьте свои знания и получите сертификаты, подтверждающие ваши навыки в области кибербезопасности.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск тестов..."
                className="w-full px-4 py-3 pl-12 rounded-lg bg-[#333333] border border-[#444444] 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
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
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 space-y-6">
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                <h3 className="text-lg font-bold text-white mb-4">Фильтры</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Категория
                    </label>
                    <select 
                      className="w-full bg-[#333333] border border-[#444444] rounded-md text-gray-300 
                      py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Уровень сложности
                    </label>
                    <div className="space-y-2">
                      {levels.map(level => (
                        <label key={level} className="flex items-center">
                          <input
                            type="radio"
                            className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-[#444444]"
                            checked={selectedLevel === level}
                            onChange={() => setSelectedLevel(level)}
                          />
                          <span className="ml-2 text-gray-300">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Длительность
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="length-short"
                          className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-[#444444] rounded"
                        />
                        <span className="ml-2 text-gray-300">До 30 минут</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="length-medium"
                          className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-[#444444] rounded"
                        />
                        <span className="ml-2 text-gray-300">30-60 минут</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="length-long"
                          className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-[#444444] rounded"
                        />
                        <span className="ml-2 text-gray-300">Более 60 минут</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-md transition-colors duration-200">
                  Сбросить фильтры
                </button>
              </div>
            </div>
            
            {/* Mobile Filters Toggle */}
            <div className="md:hidden mb-6">
              <button 
                className="w-full flex items-center justify-between bg-[#222222] rounded-lg border border-[#333333] p-4"
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-300 mr-2" />
                  <span className="font-medium text-white">Фильтры</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-300 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mobile Filters Panel */}
              {showFilters && (
                <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mt-2">
                  <h3 className="text-lg font-bold text-white mb-4">Категории</h3>
                  <div className="space-y-2 mb-4">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`mobile-category-${index}`}
                          name="mobile-category"
                          className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-[#444444] rounded"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                        />
                        <label htmlFor={`mobile-category-${index}`} className="ml-2 text-sm text-gray-300">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-4">Уровень сложности</h3>
                  <div className="space-y-2 mb-4">
                    {levels.map((level, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`mobile-level-${index}`}
                          name="mobile-level"
                          className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-[#444444] rounded"
                          checked={selectedLevel === level}
                          onChange={() => setSelectedLevel(level)}
                        />
                        <label htmlFor={`mobile-level-${index}`} className="ml-2 text-sm text-gray-300">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="w-full bg-[#333333] text-gray-300 hover:bg-[#444444] py-2 rounded-md 
                    transition-colors duration-200"
                    onClick={() => {
                      setSelectedCategory('All Categories');
                      setSelectedLevel('All Levels');
                      setShowFilters(false);
                    }}
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </div>
            
            {/* Tests List */}
            <div className="flex-1">
              {/* Sort Options */}
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-gray-400">
                    Показано <span className="font-medium text-white">{filteredTests.length}</span> тестов
                  </div>
                  <select 
                    className="bg-[#333333] border border-[#444444] rounded-md text-gray-300 
                    py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularity">По популярности</option>
                    <option value="rating">По рейтингу</option>
                    <option value="newest">Сначала новые</option>
                    <option value="questions-asc">По количеству вопросов (возр.)</option>
                    <option value="questions-desc">По количеству вопросов (убыв.)</option>
                  </select>
                </div>
              </div>
              
              {/* Featured Tests */}
              {selectedCategory === 'All Categories' && selectedLevel === 'All Levels' && searchTerm === '' && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Избранные тесты</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredTests.slice(0, 2).map(test => (
                      <FeaturedTestCard key={test.id} test={test} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Test Categories */}
              {selectedCategory === 'All Categories' && selectedLevel === 'All Levels' && searchTerm === '' && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Категории тестов</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CategoryCard 
                      title="Базовая безопасность" 
                      count={testsData.filter(t => t.category === 'Базовая безопасность').length}
                      icon={<Shield className="h-8 w-8 text-blue-600" />}
                      onClick={() => setSelectedCategory('Базовая безопасность')}
                    />
                    <CategoryCard 
                      title="Сетевая безопасность" 
                      count={testsData.filter(t => t.category === 'Сетевая безопасность').length}
                      icon={<Server className="h-8 w-8 text-purple-600" />}
                      onClick={() => setSelectedCategory('Сетевая безопасность')}
                    />
                    <CategoryCard 
                      title="Защита данных" 
                      count={testsData.filter(t => t.category === 'Защита данных').length}
                      icon={<Award className="h-8 w-8 text-emerald-600" />}
                      onClick={() => setSelectedCategory('Защита данных')}
                    />
                  </div>
                </div>
              )}
              
              {/* All Tests */}
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {selectedCategory !== 'All Categories' 
                    ? selectedCategory 
                    : selectedLevel !== 'All Levels'
                      ? `${selectedLevel} Тесты`
                      : searchTerm 
                        ? `Результаты поиска для "${searchTerm}"`
                        : "Все тесты"}
                </h2>
                
                {filteredTests.length === 0 ? (
                  <div className="bg-[#222222] rounded-lg border border-[#333333] p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Тесты не найдены</h3>
                    <p className="text-gray-400 mb-4">
                      Мы не смогли найти тесты, соответствующие вашим критериям. Попробуйте отрегулировать фильтры или ключевое слово поиска.
                    </p>
                    <button 
                      className="bg-[#333333] text-gray-300 hover:bg-[#444444] px-4 py-2 rounded-md 
                      transition-colors"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All Categories');
                        setSelectedLevel('All Levels');
                      }}
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTests.map(test => (
                      <TestCard key={test.id} test={test} />
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button className="px-3 py-2 rounded-md border border-[#333333] text-gray-300 
                      hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors">
                      Предыдущий
                    </button>
                    <button className="px-3 py-2 rounded-md bg-[#ffcc00] text-black">1</button>
                    <button className="px-3 py-2 rounded-md border border-[#333333] text-gray-300 
                      hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors">2</button>
                    <button className="px-3 py-2 rounded-md border border-[#333333] text-gray-300 
                      hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors">3</button>
                    <button className="px-3 py-2 rounded-md border border-[#333333] text-gray-300 
                      hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors">
                      Следующий
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-[#222222] border-t border-[#333333] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы проверить свои знания в области кибербезопасности?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Наши тестовые испытания помогают вам определить свои сильные стороны и места для улучшения. 
            Заработайте сертификаты, чтобы продемонстрировать свою экспертность.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-8 py-3 text-lg rounded-md 
              transition-colors font-medium"
            >
              Создать бесплатную учетную запись
            </Link>
            <Link 
              to="/tests/1" 
              className="border-2 border-[#333333] text-gray-300 hover:border-[#ffcc00] 
              hover:text-[#ffcc00] px-8 py-3 text-lg rounded-md transition-colors"
            >
              Попробуйте примерный тест
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Featured Test Card Component
const FeaturedTestCard: React.FC<{ test: any }> = ({ test }) => (
  <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden flex flex-col md:flex-row 
    hover:border-[#ffcc00] transition-all duration-300">
    <div className="md:w-2/5">
      <img src={test.image} alt={test.title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6 md:w-3/5">
      <div className="flex items-center mb-2 gap-2">
        <span className="px-2 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-sm">
          {test.category}
        </span>
        <span className="px-2 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-sm">
          {test.level}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{test.title}</h3>
      <p className="text-gray-400 mb-4">{test.description}</p>
      <div className="flex items-center text-sm text-gray-400 mb-4">
        <div className="flex items-center mr-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>{test.duration}</span>
        </div>
        <div className="flex items-center">
          <ClipboardList className="h-4 w-4 mr-1" />
          <span>{test.questions} вопросов</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(test.rating) ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-gray-600'}`} 
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-300">{test.rating}</span>
        </div>
        <Link 
          to={`/tests/${test.id}`} 
          className="bg-[#ffcc00] text-black px-4 py-2 rounded-md hover:bg-[#ffd633] 
            transition-colors font-medium"
        >
          Начать тест
        </Link>
      </div>
    </div>
  </div>
);

// Test Card Component
const TestCard: React.FC<{ test: any }> = ({ test }) => (
  <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden 
    hover:border-[#ffcc00] transition-all duration-300">
    <div className="relative">
      <img src={test.image} alt={test.title} className="w-full h-48 object-cover" />
      <div className="absolute top-0 right-0 m-2">
        <span className="px-2 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-sm">
          {test.level}
        </span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-bold text-white mb-2">{test.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{test.description}</p>
      <div className="flex items-center text-sm text-gray-400 mb-4">
        <div className="flex items-center mr-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>{test.duration}</span>
        </div>
        <div className="flex items-center">
          <ClipboardList className="h-4 w-4 mr-1" />
          <span>{test.questions} вопросов</span>
        </div>
      </div>
      <Link 
        to={`/tests/${test.id}`} 
        className="block w-full bg-[#ffcc00] text-black text-center py-2 px-4 rounded-md 
          hover:bg-[#ffd633] transition-colors"
      >
        Начать тест
      </Link>
    </div>
  </div>
);

// Category Card Component
const CategoryCard: React.FC<{ 
  title: string; 
  count: number; 
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, count, icon, onClick }) => (
  <div 
    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-full bg-slate-100">{icon}</div>
      <span className="badge badge-blue">{count} Тесты</span>
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-slate-600 text-sm mb-4">
      {title === 'Базовая безопасность' 
        ? 'Тесты для начинающих, которые проверяют базовые концепции кибербезопасности.'
        : title === 'Сетевая безопасность'
          ? 'Тесты для опытных профессионалов и специалистов.'
          : 'Тесты, охватывающие стандарты и требования соответствия.'}
    </p>
    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm">
      Просмотреть тесты <ChevronRight className="h-4 w-4 ml-1" />
    </button>
  </div>
);

export default TestsPage;