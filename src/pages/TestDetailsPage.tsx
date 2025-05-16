import React, { useState } from 'react';
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

// Моковые данные теста (остаются без изменений)
const testData = {
  id: 1,
  title: "Оценка основ кибербезопасности",
  description: "Проверьте свои знания базовых концепций кибербезопасности, терминологии и лучших практик с помощью этой комплексной оценки.",
  longDescription: `
    <p>Эта комплексная оценка предназначена для проверки вашего понимания фундаментальных концепций кибербезопасности, терминологии и лучших практик. Независимо от того, новичок ли вы в этой области или хотите подтвердить свои базовые знания, этот тест поможет вам определить ваши сильные стороны и области для улучшения.</p>
    
    <p>Оценка охватывает широкий спектр тем, включая принципы безопасности, распространенные угрозы и уязвимости, базовые механизмы защиты, концепции аутентификации и политики безопасности. Вопросы представлены в различных форматах, включая множественный выбор, истина/ложь и задачи на основе сценариев.</p>
    
    <p>После завершения вы получите подробный анализ вашей производительности по тематическим областям, а также рекомендации для дальнейшего обучения на основе ваших результатов. Эта оценка - отличный способ оценить вашу готовность к начальным позициям в кибербезопасности или более продвинутому обучению.</p>
  `,
  image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  category: "Базовая кибербезопасность",
  level: "Начальный",
  duration: "45 мин",
  questions: 50,
  participants: 3542,
  rating: 4.8,
  passingScore: 70,
  attempts: 2,
  tags: ["основы", "фундаментальные", "оценка"],
  topics: [
    {
      name: "Принципы безопасности",
      questionCount: 10,
      description: "Основные концепции безопасности, включая триаду ЦРД, многоуровневую защиту и принцип наименьших привилегий"
    },
    {
      name: "Распространенные угрозы",
      questionCount: 12,
      description: "Идентификация типов вредоносного ПО, тактик социальной инженерии и векторов атак"
    },
    {
      name: "Аутентификация и контроль доступа",
      questionCount: 8,
      description: "Безопасность паролей, многофакторная аутентификация и модели контроля доступа"
    },
    {
      name: "Сетевая безопасность",
      questionCount: 10,
      description: "Базовые концепции сетевой безопасности, файерволы и безопасные протоколы"
    },
    {
      name: "Политики безопасности",
      questionCount: 5,
      description: "Понимание политик безопасности, процедур и требований соответствия"
    },
    {
      name: "Реагирование на инциденты",
      questionCount: 5,
      description: "Базовые процедуры реагирования на инциденты и лучшие практики"
    }
  ],
  sampleQuestions: [
    {
      question: "Which of the following is NOT one of the three components of the CIA triad?",
      options: [
        "Confidentiality",
        "Integrity",
        "Authentication",
        "Availability"
      ],
      correctAnswer: 2,
      explanation: "The CIA triad consists of Confidentiality, Integrity, and Availability. Authentication is an important security concept but is not part of the CIA triad."
    },
    {
      question: "What type of attack attempts to overwhelm a system's resources, making it unavailable to legitimate users?",
      options: [
        "Man-in-the-Middle Attack",
        "SQL Injection",
        "Denial of Service (DoS)",
        "Cross-Site Scripting (XSS)"
      ],
      correctAnswer: 2,
      explanation: "A Denial of Service (DoS) attack aims to make a system, service, or network unavailable by overwhelming it with a flood of traffic or requests."
    },
    {
      question: "Which of the following password practices provides the BEST security?",
      options: [
        "Using a complex 8-character password and changing it every 30 days",
        "Using a simple password that's easy to remember and never changing it",
        "Using a long passphrase with a mix of character types",
        "Using the same complex password across multiple accounts"
      ],
      correctAnswer: 2,
      explanation: "Long passphrases with a mix of character types provide better security than short complex passwords, especially when combined with other security measures like multi-factor authentication."
    }
  ],
  materials: [
    {
      title: "Cybersecurity Fundamentals Study Guide",
      type: "pdf",
      size: "2.4 MB"
    },
    {
      title: "Common Threats Cheat Sheet",
      type: "pdf",
      size: "1.2 MB"
    },
    {
      title: "Practice Questions Set",
      type: "pdf",
      size: "1.8 MB"
    }
  ],
  reviews: [
    {
      user: {
        name: "John Smith",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      },
      rating: 5,
      date: "May 16, 2025",
      comment: "Excellent assessment! The questions were well-crafted and really tested my understanding of cybersecurity fundamentals. The detailed feedback after completion was incredibly helpful in identifying areas where I need to improve."
    },
    {
      user: {
        name: "Emily Davis",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      },
      rating: 4,
      date: "May 10, 2025",
      comment: "Very comprehensive test that covers all the basics. I would have liked more scenario-based questions, but overall it was a great way to validate my knowledge. The study materials provided were also very helpful."
    },
    {
      user: {
        name: "Michael Chen",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
      },
      rating: 5,
      date: "May 5, 2025",
      comment: "I used this assessment to prepare for my CompTIA Security+ exam and found it extremely valuable. The questions are challenging but fair, and the explanations for incorrect answers helped me understand concepts I was struggling with."
    }
  ],
  relatedTests: [
    {
      id: 2,
      title: "Основы сетевой безопасности",
      description: "Изучите основные концепции сетевой безопасности и защиты инфраструктуры.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      duration: "30 мин",
      questions: 25,
      rating: 4.7
    },
    {
      id: 3,
      title: "Тест по защите от фишинга",
      description: "Проверьте свои навыки распознавания фишинговых атак и социальной инженерии.",
      image: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      duration: "20 мин",
      questions: 20,
      rating: 4.9
    }
  ]
};

const TestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption !== null) {
      setShowExplanation(true);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < testData.sampleQuestions.length - 1) {
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

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Test Header */}
      <section className="bg-[#222222] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                <Link to="/tests" className="hover:text-white">Tests</Link>
                <span>/</span>
                <Link to={`/tests?category=${testData.category}`} className="hover:text-white">{testData.category}</Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{testData.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{testData.description}</p>
              
              <div className="flex flex-wrap items-center text-sm text-gray-300 mb-6 gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-medium">{testData.rating}</span>
                  <span className="ml-1">({testData.participants.toLocaleString()} participants)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{testData.duration}</span>
                </div>
                <div className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-1" />
                  <span>{testData.questions} questions</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-sm">{testData.level}</span>
                <span className="px-3 py-1 bg-[#333333] text-green-400 rounded-full text-sm">{testData.category}</span>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden text-white">
                <div className="relative">
                  <img src={testData.image} alt={testData.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <button className="bg-[#ffcc00] hover:bg-[#ffd633] text-black rounded-full p-4 transition-colors duration-200">
                      <Play className="h-8 w-8" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <button className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors w-full mb-3">Начать тест</button>
                  <button className="border-2 border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00]/10 px-4 py-2 rounded-md font-medium transition-colors w-full mb-6">Download Study Materials</button>
                  
                  <div className="text-sm text-gray-400 space-y-4">
                    <div className="font-medium text-white">Test Information:</div>
                    <div className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{testData.questions} questions</span>
                    </div>
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Time limit: {testData.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Passing score: {testData.passingScore}%</span>
                    </div>
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Attempts allowed: {testData.attempts}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Test Content */}
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
                  Overview
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'sample' 
                      ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' 
                      : 'text-gray-400 hover:text-[#ffcc00]'
                  }`}
                  onClick={() => setActiveTab('sample')}
                >
                  Sample Questions
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'materials' 
                      ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' 
                      : 'text-gray-400 hover:text-[#ffcc00]'
                  }`}
                  onClick={() => setActiveTab('materials')}
                >
                  Study Materials
                </button>
                <button 
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'reviews' 
                      ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' 
                      : 'text-gray-400 hover:text-[#ffcc00]'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mb-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">About This Test</h2>
                  <div 
                    className="prose prose-invert max-w-none mb-8 text-gray-300"
                    dangerouslySetInnerHTML={{ __html: testData.longDescription }}
                  ></div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">Topics Covered</h3>
                  <div className="space-y-4 mb-8">
                    {testData.topics.map((topic, index) => (
                      <div key={index} className="border border-[#333333] rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-white">{topic.name}</h4>
                          <span className="text-sm text-gray-400">{topic.questionCount} questions</span>
                        </div>
                        <p className="text-gray-400 text-sm">{topic.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">Test Format</h3>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Multiple-choice questions with single correct answers</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">True/False questions to test fundamental knowledge</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Scenario-based questions to test practical application of concepts</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Immediate feedback after test completion</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Detailed performance analysis by topic area</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">Certification</h3>
                  <div className="bg-[#333333] p-4 rounded-lg border border-[#444444] flex items-center mb-8">
                    <Award className="h-10 w-10 text-[#ffcc00] mr-4" />
                    <div>
                      <div className="font-medium text-white">Cybersecurity Fundamentals Certificate</div>
                      <div className="text-sm text-gray-400">Earn a certificate upon achieving a score of 70% or higher</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {testData.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sample Questions Tab */}
              {activeTab === 'sample' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Sample Questions</h2>
                  <p className="text-gray-400 mb-6">
                    Try these sample questions to get a feel for the test format and difficulty level. These questions are representative of what you'll encounter in the full assessment.
                  </p>
                  
                  <div className="bg-[#333333] rounded-lg border border-[#444444] p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-400">
                        Question {currentQuestionIndex + 1} of {testData.sampleQuestions.length}
                      </div>
                      <div className="px-3 py-1 bg-[#444444] text-[#ffcc00] rounded-full text-sm">{testData.topics[currentQuestionIndex % testData.topics.length].name}</div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-4 text-white">{testData.sampleQuestions[currentQuestionIndex].question}</h3>
                    
                    <div className="space-y-3 mb-6">
                      {testData.sampleQuestions[currentQuestionIndex].options.map((option, index) => (
                        <div 
                          key={index}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedOption === index 
                              ? 'border-[#ffcc00] bg-[#444444]' 
                              : 'border-[#444444] hover:border-[#ffcc00] hover:bg-[#444444]'
                          } ${
                            showExplanation && index === testData.sampleQuestions[currentQuestionIndex].correctAnswer
                              ? 'border-green-500 bg-green-900/50'
                              : showExplanation && selectedOption === index
                                ? 'border-red-500 bg-red-900/50'
                                : ''
                          }`}
                          onClick={() => !showExplanation && handleOptionSelect(index)}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              selectedOption === index 
                                ? 'bg-[#ffcc00] text-black' 
                                : 'bg-[#444444] text-white'
                            } ${
                              showExplanation && index === testData.sampleQuestions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-500 text-white'
                                : showExplanation && selectedOption === index
                                  ? 'bg-red-500 text-white'
                                  : ''
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-white">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {showExplanation && (
                      <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mb-6">
                        <div className="font-bold mb-2 text-white">Explanation:</div>
                        <p className="text-gray-300">{testData.sampleQuestions[currentQuestionIndex].explanation}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <button 
                        className="border-2 border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00]/10 px-4 py-2 rounded-md font-medium transition-colors"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        Previous
                      </button>
                      
                      {!showExplanation ? (
                        <button 
                          className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors"
                          onClick={handleSubmitAnswer}
                          disabled={selectedOption === null}
                        >
                          Check Answer
                        </button>
                      ) : (
                        <button 
                          className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors"
                          onClick={handleNextQuestion}
                          disabled={currentQuestionIndex === testData.sampleQuestions.length - 1}
                        >
                          Next Question
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-8 py-2 rounded-md font-medium transition-colors">Start Full Test</button>
                  </div>
                </div>
              )}
              
              {/* Materials Tab */}
              {activeTab === 'materials' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-white">Study Materials</h2>
                  <p className="mb-6 text-gray-400">
                    Download these resources to help you prepare for the test. These materials cover all the topics included in the assessment and provide additional practice opportunities.
                  </p>
                  
                  <div className="space-y-4">
                    {testData.materials.map((material, index) => (
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
                        <button className="border-2 border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00]/10 px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-white">Test Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(testData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="font-medium text-lg text-white">{testData.rating}</span>
                        <span className="text-gray-400 ml-1">({testData.participants} participants)</span>
                      </div>
                    </div>
                    <button className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors mt-4 md:mt-0">Write a Review</button>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {testData.reviews.map((review, index) => (
                      <div key={index} className="border-b border-[#333333] pb-6 last:border-0">
                        <div className="flex items-start">
                          <img 
                            src={review.user.image} 
                            alt={review.user.name} 
                            className="w-10 h-10 rounded-full mr-4"
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
                                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-400">{review.date}</span>
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-gray-300">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                            </div>
                            <p className="mt-2 text-gray-300">{review.comment}</p>
                            <div className="mt-3 flex items-center">
                              <button className="text-sm text-gray-400 hover:text-gray-300 flex items-center mr-4">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                <span>Helpful</span>
                              </button>
                              <button className="text-sm text-gray-400 hover:text-gray-300">Report</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button className="border-2 border-[#ffcc00] text-[#ffcc00] hover:bg-[#ffcc00]/10 px-4 py-2 rounded-md font-medium transition-colors">Load More Reviews</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Related Tests */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Related Tests</h3>
              <div className="space-y-4">
                {testData.relatedTests.map(test => (
                  <RelatedTestCard key={test.id} test={test} />
                ))}
              </div>
            </div>
            
            {/* Test Stats */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Test Statistics</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Average Score</span>
                  <span className="font-medium">76%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pass Rate</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg. Completion Time</span>
                  <span className="font-medium">38 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Difficulty Rating</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < 3 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Certificate */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-2 text-white">Earn a Certificate</h3>
              <p className="text-gray-400 text-sm mb-4">
                Complete this test with a score of 70% or higher to earn a certificate that you can add to your resume or share on LinkedIn.
              </p>
              <div className="bg-[#333333] p-4 rounded-lg border border-[#444444] flex items-center">
                <Award className="h-10 w-10 text-[#ffcc00] mr-4" />
                <div>
                  <div className="font-medium text-white">Cybersecurity Fundamentals Certificate</div>
                  <div className="text-sm text-gray-400">Recognized by industry professionals</div>
                </div>
              </div>
            </div>
            
            {/* Share Test */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Share This Test</h3>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </button>
                <button className="flex-1 bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Twitter
                </button>
                <button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-md flex items-center justify-center">
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
      
      {/* More Tests Section */}
      <section className="py-12 bg-[#222222]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">More Tests You Might Like</h2>
            <Link to="/tests" className="text-[#ffcc00] hover:text-[#ffd633] font-medium flex items-center">
              View All Tests <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testData.relatedTests.map(test => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Обновленный RelatedTestCard с темной темой
const RelatedTestCard: React.FC<{ test: any }> = ({ test }) => (
  <div className="flex items-start">
    <img src={test.image} alt={test.title} className="w-16 h-16 object-cover rounded-md mr-3" />
    <div className="flex-1">
      <h4 className="font-medium text-sm mb-1 line-clamp-2 text-white">{test.title}</h4>
      <div className="flex items-center text-xs text-gray-400">
        <Clock className="h-3 w-3 mr-1" />
        <span>{test.duration}</span>
        <span className="mx-1">•</span>
        <ClipboardList className="h-3 w-3 mr-1" />
        <span>{test.questions} вопросов</span>
      </div>
    </div>
  </div>
);

// Обновленный TestCard с темной темой
const TestCard: React.FC<{ test: any }> = ({ test }) => (
  <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden hover:border-[#ffcc00] transition-all duration-300">
    <div className="relative">
      <img src={test.image} alt={test.title} className="w-full h-48 object-cover" />
      <div className="absolute top-0 right-0 m-2">
        <span className="px-3 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-sm">{test.level}</span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-bold mb-2 text-white">{test.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{test.description}</p>
      <div className="flex items-center text-sm text-gray-400 mb-4">
        <div className="flex items-center mr-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>{test.duration}</span>
        </div>
        <div className="flex items-center">
          <ClipboardList className="h-4 w-4 mr-1" />
          <span>{test.questions} questions</span>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(test.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
              />
            ))}
          </div>
          <span className="ml-1">{test.rating}</span>
        </div>
        <span className="text-xs px-2 py-1 bg-[#333333] rounded-full text-gray-300">{test.category}</span>
      </div>
      <Link to={`/tests/${test.id}`} className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors w-full text-center block">
        Начать тест
      </Link>
    </div>
  </div>
);

export default TestDetailsPage;