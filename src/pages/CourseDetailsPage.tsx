import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Star, 
  Award, 
  BookOpen, 
  Download, 
  Play, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Share2,
  Heart,
  FileText,
  Video,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { courseService } from '../api/services/course.service';
import { Course } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [sections, setSections] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      courseService.getCourse(Number(id)),
      courseService.getCourseSections(Number(id)),
      courseService.getCourseMaterials(Number(id)),
      courseService.getCourseReviews(Number(id)),
    ])
      .then(([courseData, sectionsData, materialsData, reviewsData]) => {
        setCourse(courseData);
        setSections(sectionsData);
        setMaterials(materialsData);
        setReviews(reviewsData);
      })
      .catch((err) => {
        setError('Ошибка загрузки данных курса');
        setCourse(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSection = (index: number) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter(i => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Загрузка курса..." />;
  }
  if (error || !course) {
    return <ErrorDisplay error={error || 'Курс не найден'} retryFn={() => window.location.reload()} />;
  }

  // Исправленные вычисления и обращения к полям
  const objectives = Array.isArray((course as any).objectives) ? (course as any).objectives : [];
  const prerequisites = (course as any).prerequisites || '';
  const instructor = course.instructor || { name: '', image: '', id: '' };
  const totalLessons = sections.reduce((total: any, section: any) => total + (section.lessons?.length || 0), 0);
  const totalDuration = sections.reduce((total: any, section: any) => {
    return total + (section.lessons?.reduce((sectionTotal: any, lesson: any) => {
      const minutes = parseInt(lesson.duration?.split(' ')[0] || '0');
      return sectionTotal + minutes;
    }, 0) || 0);
  }, 0);
  const formatTotalDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };
  const completedLessons = sections.reduce((total: any, section: any) => {
    return total + (section.lessons?.filter((lesson: any) => lesson.completed).length || 0);
  }, 0);
  
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Course Header */}
      <section className="bg-[#222222] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                <Link to="/courses" className="hover:text-[#ffcc00]">Курсы</Link>
                <span>/</span>
                <Link to="/courses?category=Basic%20Cybersecurity" className="hover:text-[#ffcc00]">{course.category}</Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center text-sm text-gray-300 mb-6 gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-[#ffcc00] fill-[#ffcc00] mr-1" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="ml-1">({course.students.toLocaleString()} студентов)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-1" />
                  <span>{totalLessons} уроков</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-1" />
                  <span>{course.language}</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-1" />
                  <span>Обновлено {course.last_updated}</span>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <img 
                  src={instructor.image} 
                  alt={instructor.name} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="font-medium text-gray-300">Автор курса</div>
                  <div className="text-[#ffcc00]">{instructor.name}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#333333] text-[#ffcc00] px-3 py-1 rounded-full">{course.level}</span>
                {course.certificate && (
                  <span className="bg-[#333333] text-[#ffcc00] px-3 py-1 rounded-full flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Сертификат
                  </span>
                )}
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden text-white">
                <div className="relative">
                  <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <button className="bg-[#ffcc00] hover:bg-[#ffd633] text-black rounded-full p-4 transition-colors duration-200">
                      <Play className="h-8 w-8" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-bold">{course.price}</span>
                    <span className="text-gray-400 line-through">$99.99</span>
                  </div>
                  
                  <button className="bg-[#ffcc00] text-black hover:bg-[#ffd633] transition-colors w-full mb-3 py-2 px-4 rounded-md font-medium">
                    Записаться на курс
                  </button>
                  <button className="border-2 border-[#333333] text-gray-300 hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors w-full mb-6 py-2 px-4 rounded-md font-medium">
                    Добавить в избранное
                  </button>
                  
                  <div className="text-sm text-gray-400 space-y-4">
                    <div className="font-medium">Этот курс включает:</div>
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{formatTotalDuration(totalDuration)} видео-контента</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{materials.length} скачиваемых ресурсов</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Полный пожизненный доступ</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Сертификат об окончании</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-[#333333]">
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-2">Не уверены? Попробуйте бесплатный предпросмотр</p>
                      <button className="text-[#ffcc00] hover:text-[#ffd633] text-sm font-medium">
                        Предпросмотр первого модуля
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Progress */}
      <div className="bg-[#222222] border-b border-[#333333]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-[#333333] flex items-center justify-center text-[#ffcc00] font-bold text-lg mr-4">
                {progressPercentage}%
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Ваш прогресс</div>
                <div className="w-48 h-2 bg-[#333333] rounded-full">
                  <div 
                    className="h-2 bg-[#ffcc00] rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="border-2 border-[#333333] text-gray-300 hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors py-2 px-4 rounded-md flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Поделиться</span>
              </button>
              <button className="border-2 border-[#333333] text-gray-300 hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors py-2 px-4 rounded-md flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Сохранить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="mb-8 border-b border-[#333333]">
              <div className="flex overflow-x-auto">
                <button 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'overview' 
                      ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' 
                      : 'text-gray-400 hover:text-[#ffcc00]'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Обзор
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'curriculum' 
                      ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' 
                      : 'text-gray-400 hover:text-[#ffcc00]'
                  }`}
                  onClick={() => setActiveTab('curriculum')}
                >
                  Программа
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'instructor' 
                      ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' 
                      : 'text-gray-400 hover:text-[#ffcc00]'
                  }`}
                  onClick={() => setActiveTab('instructor')}
                >
                  Преподаватель
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'reviews' 
                      ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' 
                      : 'text-gray-400 hover:text-[#ffcc00]'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Отзывы
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'materials' 
                      ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' 
                      : 'text-gray-400 hover:text-[#ffcc00]'
                  }`}
                  onClick={() => setActiveTab('materials')}
                >
                  Материалы
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mb-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">О курсе</h2>
                  <div 
                    className="prose max-w-none mb-8 text-gray-300"
                    dangerouslySetInnerHTML={{ __html: course.long_description || '' }}
                  ></div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">Чему вы научитесь</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {objectives.map((objective: any, index: number) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#ffcc00] mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{objective}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">Предварительные требования</h3>
                  <p className="mb-8 text-gray-300">{prerequisites}</p>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">Для кого этот курс</h3>
                  <ul className="list-disc pl-5 space-y-2 mb-8 text-gray-300">
                    <li>Начинающие без предварительных знаний в кибербезопасности</li>
                    <li>ИТ-специалисты, желающие расширить свои навыки безопасности</li>
                    <li>Владельцы бизнеса и менеджеры, ответственные за организационную безопасность</li>
                    <li>Все, кто интересуется основными концепциями кибербезопасности</li>
                  </ul>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">Теги</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Программа курса</h2>
                    <div className="text-sm text-gray-400">
                      <span className="font-medium">{totalLessons} уроков</span> • {formatTotalDuration(totalDuration)} общая продолжительность
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {sections.map((section: any, sectionIndex: number) => (
                      <div key={sectionIndex} className="border border-[#333333] rounded-lg overflow-hidden">
                        <div 
                          className="bg-[#1a1a1a] p-4 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          <div className="flex items-center">
                            <div className="mr-3">
                              {expandedSections.includes(sectionIndex) ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-white">{section.title}</h3>
                              <div className="text-sm text-gray-400">
                                {section.lessons?.length || 0} уроков • 
                                {formatTotalDuration(section.lessons?.reduce((total: any, l: any) => {
                                  return total + parseInt(l.duration?.split(' ')[0] || '0');
                                }, 0) || 0)}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-400">
                            {section.lessons?.filter((lesson: any) => lesson.completed).length || 0}/{section.lessons?.length || 0} выполнено
                          </div>
                        </div>
                        
                        {expandedSections.includes(sectionIndex) && (
                          <div className="divide-y divide-[#333333]">
                            {section.lessons?.map((lesson: any, lessonIndex: number) => (
                              <div key={lessonIndex} className="p-4 flex justify-between items-center">
                                <div className="flex items-center">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-5 w-5 text-[#ffcc00] mr-3" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border border-[#333333] mr-3"></div>
                                  )}
                                  <div className="flex items-center">
                                    {lesson.type === 'video' && <Video className="h-4 w-4 text-gray-400 mr-2" />}
                                    {lesson.type === 'quiz' && <FileText className="h-4 w-4 text-gray-400 mr-2" />}
                                    {lesson.type === 'exercise' && <BookOpen className="h-4 w-4 text-gray-400 mr-2" />}
                                    {lesson.type === 'exam' && <FileText className="h-4 w-4 text-gray-400 mr-2" />}
                                    {lesson.type === 'project' && <BookOpen className="h-4 w-4 text-gray-400 mr-2" />}
                                    <span className="text-gray-300">{lesson.title}</span>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-400 mr-3">{lesson.duration}</span>
                                  {lesson.type === 'video' && (
                                    <button className="text-[#ffcc00] hover:text-[#ffd633]">
                                      <Play className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Instructor Tab */}
              {activeTab === 'instructor' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Ваш преподаватель</h2>
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <img 
                      src={instructor.image} 
                      alt={instructor.name} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-white">{instructor.name}</h3>
                      <div className="flex items-center mb-4 space-x-4">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-[#ffcc00] fill-[#ffcc00] mr-1" />
                          <span className="font-medium text-white">4.8</span>
                          <span className="text-gray-400 ml-1">Instructor Rating</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-5 w-5 text-gray-400 mr-1" />
                          <span className="text-gray-300">823 Reviews</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-1" />
                          <span className="text-gray-300">12,543 Students</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 text-gray-400 mr-1" />
                          <span className="text-gray-300">8 Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-white">Отзывы студентов</h2>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-gray-400'}`} 
                            />
                          ))}
                        </div>
                        <span className="font-medium text-lg text-white">{course.rating}</span>
                        <span className="text-gray-400 ml-1">({course.students} студентов)</span>
                      </div>
                    </div>
                    <button className="bg-[#ffcc00] text-black hover:bg-[#ffd633] transition-colors mt-4 md:mt-0 py-2 px-4 rounded-md font-medium">
                      Написать отзыв
                    </button>
                  </div>
                  
                  {/* Rating Distribution */}
                  <div className="bg-[#333333] p-6 rounded-lg mb-8">
                    <h3 className="font-bold mb-4 text-white">Распределение рейтинга</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => (
                        <div key={rating} className="flex items-center">
                          <div className="flex items-center w-20">
                            <span className="mr-2 text-gray-300">{rating}</span>
                            <Star className="h-4 w-4 text-[#ffcc00] fill-[#ffcc00]" />
                          </div>
                          <div className="flex-1 h-4 bg-[#444444] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#ffcc00]" 
                              style={{ 
                                width: `${rating === 5 ? 75 : rating === 4 ? 20 : rating === 3 ? 3 : rating === 2 ? 1 : 1}%` 
                              }}
                            ></div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-400">
                            {rating === 5 ? '75%' : rating === 4 ? '20%' : rating === 3 ? '3%' : rating === 2 ? '1%' : '1%'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b border-[#333333] pb-6 last:border-0">
                        <div className="flex items-start">
                          <img 
                            src={review.user.image} 
                            alt={review.user.name} 
                            className="w-12 h-12 rounded-full mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-white">{review.user.name}</h4>
                                <div className="flex items-center">
                                  <div className="flex mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < review.rating ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-gray-400'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400">{review.date}</span>
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-[#ffcc00]">
                                <MessageSquare className="h-5 w-5" />
                              </button>
                            </div>
                            <p className="mt-2 text-gray-300">{review.comment}</p>
                            <div className="mt-3 flex items-center">
                              <button className="text-sm text-gray-400 hover:text-[#ffcc00] flex items-center mr-4">
                                <span className="mr-1">Полезно</span>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905 0 .905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                              </button>
                              <button className="text-sm text-gray-400 hover:text-[#ffcc00]">Пожаловаться</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button className="border-2 border-[#333333] text-gray-300 hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors py-2 px-4 rounded-md">
                      Загрузить еще отзывы
                    </button>
                  </div>
                </div>
              )}
              
              {/* Materials Tab */}
              {activeTab === 'materials' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Материалы курса</h2>
                  <p className="mb-6 text-gray-400">
                    Скачайте эти ресурсы, чтобы улучшить ваш опыт обучения. Эти материалы дополняют видеоуроки и предоставляют дополнительную информацию и упражнения.
                  </p>
                  
                  <div className="space-y-4">
                    {materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-[#333333] rounded-lg">
                        <div className="flex items-center">
                          <div className="p-2 bg-[#333333] rounded-lg mr-4">
                            <FileText className="h-6 w-6 text-[#ffcc00]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{material.title}</h4>
                            <div className="text-sm text-gray-400">
                              {material.type.toUpperCase()} • {material.size}
                            </div>
                          </div>
                        </div>
                        <button className="border-2 border-[#333333] text-gray-300 hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors flex items-center space-x-2 py-2 px-4 rounded-md">
                          <Download className="h-4 w-4" />
                          <span>Скачать</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Related Courses */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Связанные курсы</h3>
              <div className="space-y-4">
                <RelatedCourseCard 
                  title="Network Security Fundamentals"
                  instructor="Prof. Michael Chen"
                  rating={4.7}
                  price="$59.99"
                  image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                />
                <RelatedCourseCard 
                  title="Introduction to Ethical Hacking"
                  instructor="Alex Rodriguez"
                  rating={4.9}
                  price="$69.99"
                  image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                />
                <RelatedCourseCard 
                  title="Data Privacy and Protection"
                  instructor="Dr. Emily Zhang"
                  rating={4.6}
                  price="$49.99"
                  image="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                />
              </div>
              <button className="mt-4 text-[#ffcc00] hover:text-[#ffd633] text-sm font-medium w-full text-center">
                Посмотреть все связанные курсы
              </button>
            </div>
            
            {/* Course Requirements */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Требования</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <div className="text-[#ffcc00] mr-2">•</div>
                  <span>Базовые знания компьютера и использования интернета</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#ffcc00] mr-2">•</div>
                  <span>Опыт в кибербезопасности не требуется</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#ffcc00] mr-2">•</div>
                  <span>Компьютер с доступом в интернет</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#ffcc00] mr-2">•</div>
                  <span>Желание изучать и практиковать концепции безопасности</span>
                </li>
              </ul>
            </div>
            
            {/* Share Course */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Поделиться курсом</h3>
              <div className="flex space-x-3">
                <button className="flex-1 bg-[#3b5998] hover:bg-[#4267b2] text-white p-2 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </button>
                <button className="flex-1 bg-[#1da1f2] hover:bg-[#1a91da] text-white p-2 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Twitter
                </button>
                <button className="flex-1 bg-[#0077b5] hover:bg-[#006699] text-white p-2 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Related Course Card Component
const RelatedCourseCard: React.FC<{
  title: string;
  instructor: string;
  rating: number;
  price: string;
  image: string;
}> = ({ title, instructor, rating, price, image }) => (
  <div className="flex items-start">
    <img src={image} alt={title} className="w-16 h-16 object-cover rounded-md mr-3" />
    <div className="flex-1">
      <h4 className="font-medium text-sm mb-1 text-white">{title}</h4>
      <p className="text-xs text-gray-400 mb-1">{instructor}</p>
      <div className="flex items-center">
        <div className="flex mr-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-gray-400'}`} 
            />
          ))}
        </div>
        <span className="text-xs text-gray-300">{rating}</span>
      </div>
    </div>
    <div className="text-sm font-bold text-white">{price}</div>
  </div>
);

export default CourseDetailsPage;