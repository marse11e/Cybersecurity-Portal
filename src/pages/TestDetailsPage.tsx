import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  Star, 
  ChevronRight, 
  Play,
  CheckCircle,
  ClipboardList,
  FileText,
  Award,
  HelpCircle,
  Timer,
  ThumbsUp
} from 'lucide-react';
import { testService } from '../api/services/test.service';
import { Test, TestQuestion, TestResult } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const TestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      testService.getTest(Number(id)),
      testService.getTestQuestions(Number(id)),
      testService.getTestResults(Number(id)),
    ])
      .then(([testData, questionsData, resultsData]) => {
        setTest(testData);
        setQuestions(questionsData);
        setResults(resultsData);
      })
      .catch(() => {
        setError('Ошибка загрузки теста');
        setTest(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  const handleSubmitAnswer = () => {
    if (selectedOption !== null) {
      setShowExplanation(true);
    }
  };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  // Универсальная функция для получения имени категории
  const getCategoryName = (category: string | number | any | null | undefined): string => {
    if (!category) return '';
    if (typeof category === 'object') return category.name;
    return String(category);
  };

  // Универсальная функция для получения имени тега
  const getTagName = (tag: string | number | any | null | undefined): string => {
    if (!tag) return '';
    if (typeof tag === 'object') return tag.name;
    return String(tag);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">Загрузка теста...</div>;
  }
  if (error || test === null) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="bg-[#222222] p-8 rounded-lg border border-[#333333] text-center">
          <div className="text-2xl font-bold text-white mb-4">Требуется авторизация</div>
          <div className="text-gray-400 mb-6">Для просмотра подробной информации о тесте необходимо войти в систему.</div>
          <a href="/login" className="bg-[#ffcc00] text-black px-6 py-2 rounded-md font-medium hover:bg-[#ffd633]">Войти</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Test Header */}
      <section className="bg-[#222222] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                <Link to="/tests" className="hover:text-white">Тесты</Link>
                <span>/</span>
                <Link to={`/tests?category=${getCategoryName(test.category)}`} className="hover:text-white">{getCategoryName(test.category)}</Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{test.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{test.description}</p>
              <div className="flex flex-wrap items-center text-sm text-gray-300 mb-6 gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-medium">{test.rating}</span>
                  <span className="ml-1">({test.participants?.toLocaleString()} участников)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{test.duration} мин</span>
                </div>
                <div className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-1" />
                  <span>{test.questions_count} вопросов</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-sm">{test.level}</span>
                <span className="px-3 py-1 bg-[#333333] text-green-400 rounded-full text-sm">{getCategoryName(test.category)}</span>
              </div>
              {/* Отображение тегов теста, если есть */}
              {Array.isArray(test.tags) && test.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {test.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm">
                      {getTagName(tag)}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="md:w-1/3">
              <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden text-white">
                <div className="relative">
                  <img src={test.image} alt={test.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <button className="bg-[#ffcc00] hover:bg-[#ffd633] text-black rounded-full p-4 transition-colors duration-200">
                      <Play className="h-8 w-8" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <button className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors w-full mb-3">Начать тест</button>
                  {/* Материалы и прочее можно добавить позже */}
                  <div className="text-sm text-gray-400 space-y-4">
                    <div className="font-medium text-white">Информация о тесте:</div>
                    <div className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{test.questions_count} вопросов</span>
                    </div>
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Ограничение по времени: {test.duration} мин</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Проходной балл: {test.passing_score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ... остальной JSX, tabs, вопросы, результаты ... */}
    </div>
  );
};

export default TestDetailsPage;