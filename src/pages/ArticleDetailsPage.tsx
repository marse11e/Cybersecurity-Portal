import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  ThumbsUp,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  ChevronRight,
  Eye,
  ArrowLeft,
  Send
} from 'lucide-react';
import { articleService } from '../api/services/article.service';
import { Article, Category, Tag } from '../api/types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ArticleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        const data = await articleService.getArticle(Number(id));
        if (data && typeof data === 'object') {
          setArticle(data);
          
          // Загрузка похожих статей
          try {
            const relatedData = await articleService.getArticles({
              category: typeof data.category === 'object' && data.category !== null ? data.category.slug : String(data.category),
              page_size: 3
            });
            if (Array.isArray(relatedData)) {
              setRelatedArticles(relatedData.filter(a => a.id !== Number(id)).slice(0, 3));
            }
          } catch (err) {
            console.error('Ошибка загрузки похожих статей:', err);
          }
        } else {
          console.error('API вернул неверный формат данных статьи:', data);
          setError('Ошибка загрузки данных статьи');
        }
      }
    } catch (err: any) {
      console.error('Ошибка загрузки статьи:', err);
      setError('Ошибка загрузки статьи');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    if (!article || !id) return;
    
    try {
      await articleService.likeArticle(Number(id));
      setLiked(!liked);
      if (article) {
        setArticle({
          ...article,
          likes: article.likes + 1
        });
      }
    } catch (err) {
      console.error('Ошибка при лайке статьи:', err);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };
  
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentText('');
    // Здесь можно добавить отправку комментария на API
  };
  
  const handleSubmitReply = (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    setReplyText('');
    setReplyingTo(null);
    // Здесь можно добавить отправку ответа на API
  };

  // Получаем название категории (строку) из объекта категории, строки или числа
  const getCategoryName = (category: string | number | Category | null | undefined): string => {
    if (!category) return '';
    if (typeof category === 'object') return category.name;
    return String(category);
  };

  // Получаем строковое представление тега из объекта тега, строки или числа
  const getTagName = (tag: string | number | Tag | null | undefined): string => {
    if (!tag) return '';
    if (typeof tag === 'object') return tag.name;
    return String(tag);
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Загрузка статьи..." />;
  }
  
  if (error || article === null) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="bg-[#222222] p-8 rounded-lg border border-[#333333] text-center">
          <div className="text-2xl font-bold text-white mb-4">Требуется авторизация</div>
          <div className="text-gray-400 mb-6">Для просмотра подробной информации о статье необходимо войти в систему.</div>
          <a href="/login" className="bg-[#ffcc00] text-black px-6 py-2 rounded-md font-medium hover:bg-[#ffd633]">Войти</a>
        </div>
      </div>
    );
  }
  
  const categoryName = getCategoryName(typeof article.category === 'number' ? String(article.category) : article.category);
  
  // Безопасно приводим дату к строке
  const dateStr = typeof article.date === 'object' ? 
    JSON.stringify(article.date).replace(/"/g, '') : 
    String(article.date || '');

  // Готовим массив тегов
  const tags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Article Header */}
      <section className="bg-[#222222] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <Link to="/articles" className="hover:text-white flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Назад к статьям
              </Link>
              <span>/</span>
              <Link to={`/articles?category=${getCategoryName(article.category)}`} className="hover:text-white">
                {getCategoryName(article.category)}
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-xl text-gray-300 mb-6">{article.description}</p>
            
            <div className="flex flex-wrap items-center text-sm text-gray-300 mb-6 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-1" />
                <span>{dateStr}</span>
              </div>
              {typeof article.views === 'number' && (
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-1" />
                  <span>{article.views.toLocaleString()} просмотров</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center mb-6">
              {article.author && typeof article.author === 'object' && (
                <>
                  <img 
                    src={article.author.image || article.author.avatar || ''} 
                    alt={article.author.first_name} 
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">{article.author.first_name} {article.author.last_name}</div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm">
                  #{getTagName(tag)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Article Image */}
              {article.image && (
                <div className="mb-8">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
              
              {/* Article Actions */}
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-4 mb-8 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button 
                    className={`flex items-center space-x-1 ${liked ? 'text-[#ffcc00]' : 'text-gray-400'}`}
                    onClick={handleLike}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>{typeof article.likes === 'number' ? article.likes : 0}</span>
                  </button>
                  <button 
                    className="flex items-center space-x-1 text-gray-400"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>{typeof article.comments_count === 'number' ? article.comments_count : 0}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button 
                      className="text-gray-400 hover:text-[#ffcc00]"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    {showShareOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#333333] rounded-md border border-[#444444] py-1 z-10">
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#444444]"
                          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                        >
                          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                          Facebook
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#444444]"
                          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')}
                        >
                          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                          Twitter
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#444444]"
                          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                        >
                          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                          LinkedIn
                        </button>
                        <button 
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#444444]"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copySuccess ? 'Скопировано!' : 'Копировать ссылку'}
                        </button>
                      </div>
                    )}
                  </div>
                  <button 
                    className={`text-gray-400 hover:text-[#ffcc00] ${bookmarked ? 'text-[#ffcc00]' : ''}`}
                    onClick={handleBookmark}
                  >
                    <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-[#ffcc00]' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-8 mb-8">
                <div 
                  className="prose prose-lg prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: typeof article.content === 'string' ? article.content : '' }}
                ></div>
              </div>
              
              {/* Author Bio */}
              {article.author && typeof article.author === 'object' && (
                <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mb-8">
                  <div className="flex items-start">
                    <img 
                      src={article.author.image || article.author.avatar || ''} 
                      alt={`${article.author.first_name} ${article.author.last_name}`} 
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-white">Об авторе {article.author.first_name} {article.author.last_name}</h3>
                      <p className="text-gray-400 mb-4">Эксперт в области кибербезопасности и автор образовательного контента.</p>
                      <Link to={`/authors/${article.author.id}`} className="text-[#ffcc00] hover:text-[#ffd633] font-medium">
                        Просмотреть все статьи этого автора
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Comments Section (заглушка, можно подключить к API) */}
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mb-8">
                <h3 className="text-xl font-bold mb-6 text-white">
                  Комментарии ({typeof article.comments_count === 'number' ? article.comments_count : 0})
                </h3>
                
                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <div className="flex items-start space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                      alt="Ваш аватар" 
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        placeholder="Добавить комментарий..."
                        className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00] min-h-[100px]"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button 
                          type="submit" 
                          className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors"
                          disabled={!commentText.trim()}
                        >
                          Отправить комментарий
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                
                {/* Заглушка для пустого списка комментариев */}
                <div className="text-center py-6 text-gray-400">
                  Будьте первым, кто оставит комментарий!
                </div>
                
                {/* Пример комментария можно раскомментировать и подключить к API
                <div className="space-y-6">
                  <div className="border-b border-[#333333] pb-6 last:border-0">
                    <div className="flex items-start">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
                        alt="User" 
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white">Михаил Чен</h4>
                            <div className="text-sm text-gray-400">16 мая 2023</div>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-300">Отличная статья! Я работаю в сфере IT в здравоохранении, и мы внедрили многие из этих мер.</p>
                        <div className="mt-3 flex items-center space-x-4">
                          <button className="text-sm text-gray-400 hover:text-[#ffcc00] flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>12</span>
                          </button>
                          <button 
                            className="text-sm text-gray-400 hover:text-[#ffcc00]"
                            onClick={() => setReplyingTo(1)}
                          >
                            Ответить
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                */}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-6">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                  <h3 className="text-lg font-bold mb-4 text-white">Похожие статьи</h3>
                  <div className="space-y-4">
                    {relatedArticles.map(relatedArticle => (
                      <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Popular Tags */}
              {tags.length > 0 && (
                <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                  <h3 className="text-lg font-bold mb-4 text-white">Популярные теги</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`/articles?tag=${getTagName(tag)}`}
                        className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#ffcc00] hover:text-black transition-colors"
                      >
                        #{getTagName(tag)}
                      </Link>
                    ))}
                    <Link 
                      to="/articles?tag=zero-trust"
                      className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#ffcc00] hover:text-black transition-colors"
                    >
                      #zero-trust
                    </Link>
                    <Link 
                      to="/articles?tag=phishing"
                      className="px-3 py-1 bg-[#333333] text-gray-300 rounded-full text-sm hover:bg-[#ffcc00] hover:text-black transition-colors"
                    >
                      #phishing
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Newsletter Signup */}
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                <h3 className="text-lg font-bold mb-2 text-white">Будьте в курсе</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Получайте последние статьи и инсайты по кибербезопасности на вашу почту.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Ваш email"
                    className="w-full px-3 py-2 bg-[#333333] border border-[#444444] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-[#ffcc00] text-black hover:bg-[#ffd633] py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    Подписаться
                  </button>
                </form>
              </div>
              
              {/* Share Article */}
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                <h3 className="text-lg font-bold mb-4 text-white">Поделиться статьей</h3>
                <div className="flex space-x-3">
                  <button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex items-center justify-center"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                  >
                    <Facebook className="h-5 w-5 mr-2" />
                    Facebook
                  </button>
                  <button 
                    className="flex-1 bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md flex items-center justify-center"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')}
                  >
                    <Twitter className="h-5 w-5 mr-2" />
                    Twitter
                  </button>
                  <button 
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-md flex items-center justify-center"
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                  >
                    <Linkedin className="h-5 w-5 mr-2" />
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* More Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-[#222222]">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">Другие статьи, которые могут вам понравиться</h2>
              <Link to="/articles" className="text-[#ffcc00] hover:text-[#ffd633] font-medium flex items-center">
                Все статьи <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// Компонент для карточки похожей статьи
const RelatedArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  // Безопасное получение имени автора
  const authorName = article.author && typeof article.author === 'object' 
    ? `${article.author.first_name} ${article.author.last_name}` 
    : typeof article.author === 'string' ? article.author : '';
    
  return (
    <div className="flex items-start">
      <img 
        src={article.image || ''} 
        alt={article.title} 
        className="w-16 h-16 object-cover rounded-md mr-3" 
      />
      <div className="flex-1">
        <h4 className="font-medium text-sm mb-1 line-clamp-2 text-white">{article.title}</h4>
        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{typeof article.date === 'string' ? article.date : ''}</span>
        </div>
      </div>
    </div>
  );
};

// Компонент для карточки статьи
const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  // Получаем название категории
  const getCategoryName = (category: string | Category | null | undefined): string => {
    if (!category) return '';
    if (typeof category === 'object') return category.name;
    return String(category);
  };
  
  // Безопасное получение имени автора
  const authorName = article.author && typeof article.author === 'object' 
    ? `${article.author.first_name} ${article.author.last_name}` 
    : typeof article.author === 'string' ? article.author : '';
  
  return (
    <div className="bg-[#222222] rounded-lg border border-[#333333] overflow-hidden hover:border-[#ffcc00] transition-all duration-300">
      <div className="relative">
        <img 
          src={article.image || ''} 
          alt={article.title} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="px-3 py-1 bg-[#333333] text-[#ffcc00] rounded-full text-sm">
            {getCategoryName(typeof article.category === 'number' ? String(article.category) : article.category)}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{typeof article.date === 'string' ? article.date : ''}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">{article.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">{authorName}</span>
          <Link to={`/articles/${article.id}`} className="text-[#ffcc00] hover:text-[#ffd633] font-medium text-sm flex items-center">
            Читать далее <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsPage;