import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Share2,
  Flag,
  CheckCircle,
  Eye
} from 'lucide-react';
import { discussionService } from '../api/services/discussion.service';
import { Discussion, Reply } from '../api/types';

const DiscussionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchDiscussion = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const discussionData = await discussionService.getDiscussion(Number(id));
        setDiscussion(discussionData);
        
        const repliesData = await discussionService.getReplies(Number(id));
        setReplies(repliesData);
      } catch (err) {
        console.error('Error fetching discussion details:', err);
        setError('Не удалось загрузить данные обсуждения');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDiscussion();
  }, [id]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !discussion) return;
    
    try {
      const newReply = await discussionService.createReply({
        discussion: discussion.id,
        content: replyContent
      });
      
      setReplies(prev => [...prev, newReply]);
      setReplyContent('');
    } catch (err) {
      console.error('Error creating reply:', err);
      alert('Не удалось добавить ответ');
    }
  };

  const handleLike = async () => {
    if (!discussion) return;
    
    try {
      await discussionService.likeDiscussion(discussion.id);
      setLiked(true);
      setDiscussion({
        ...discussion,
        likes: discussion.likes + 1
      });
    } catch (err) {
      console.error('Error liking discussion:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] py-12 flex items-center justify-center">
        <div className="text-white">Загрузка обсуждения...</div>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] py-12 flex items-center justify-center">
        <div className="text-red-500">{error || 'Обсуждение не найдено'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12">
      <div className="container mx-auto px-4">
        {/* Навигация */}
        <div className="mb-8">
          <Link to="/forum" className="text-[#ffcc00] hover:text-[#ffd633] flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к обсуждениям
          </Link>
        </div>

        {/* Основное содержание */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Карточка обсуждения */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] mb-8">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#333333] text-[#ffcc00] px-2 py-1 rounded-full text-sm">{discussion.category}</span>
                  {discussion.solved && (
                    <span className="bg-[#333333] text-green-400 flex items-center px-2 py-1 rounded-full text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Решено
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold mb-4 text-white">
                  {discussion.title}
                </h1>

                <div className="flex items-center mb-6">
                  {discussion.author && (
                    <>
                      <img 
                        src={discussion.author.image || "https://via.placeholder.com/40"}
                        alt={discussion.author.first_name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <div className="font-medium text-white">{discussion.author.first_name} {discussion.author.last_name}</div>
                        <div className="text-sm text-gray-400">Опубликовано {discussion.date}</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="prose prose-invert max-w-none mb-6 text-gray-300">
                  <p>{discussion.description}</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#333333]">
                  <div className="flex items-center space-x-4">
                    <button 
                      className={`text-gray-300 hover:text-[#ffcc00] flex items-center ${liked ? 'text-[#ffcc00]' : ''}`}
                      onClick={handleLike}
                      disabled={liked}
                    >
                      <ThumbsUp className="h-5 w-5 mr-1" />
                      <span>{discussion.likes}</span>
                    </button>
                    <div className="text-gray-300 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-1" />
                      <span>{discussion.replies} ответов</span>
                    </div>
                    <div className="text-gray-300 flex items-center">
                      <Eye className="h-5 w-5 mr-1" />
                      <span>{discussion.views} просмотра</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-300 hover:text-[#ffcc00]">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button className="text-gray-300 hover:text-red-600">
                      <Flag className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Форма ответа */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mb-8">
              <h2 className="text-lg font-bold mb-4 text-white">Ваш ответ</h2>
              <form onSubmit={handleSubmitReply}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full mb-4 p-3 rounded-lg bg-[#333333] border border-[#444444] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                  rows={4}
                  placeholder="Напишите ваш ответ здесь..."
                />
                <button 
                  type="submit" 
                  className="bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors"
                  disabled={!replyContent.trim()}
                >
                  Отправить ответ
                </button>
              </form>
            </div>

            {/* Ответы */}
            <div className="bg-[#222222] rounded-lg border border-[#333333]">
              <div className="p-6 border-b border-[#333333]">
                <h2 className="text-lg font-bold text-white">{replies.length} ответов</h2>
              </div>
              <div className="divide-y divide-[#333333]">
                {replies.map(reply => (
                  <div key={reply.id} className="p-6">
                    <div className="flex">
                      {reply.user && (
                        <img 
                          src={reply.user.image || "https://via.placeholder.com/40"}
                          alt={reply.user.first_name} 
                          className="w-10 h-10 rounded-full mr-4"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <div className="font-medium text-white">
                              {reply.user ? `${reply.user.first_name} ${reply.user.last_name}` : 'Пользователь'}
                            </div>
                            <div className="text-sm text-gray-400">{reply.date}</div>
                          </div>
                          <button className="text-gray-400 hover:text-[#ffcc00]">
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-gray-300">{reply.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {replies.length === 0 && (
                  <div className="p-6 text-center text-gray-400">
                    Еще нет ответов. Будьте первым!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Статистика обсуждения */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-4 text-white">О дискуссии</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Создано</span>
                  <span>{discussion.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Последняя активность</span>
                  <span>{replies.length > 0 ? replies[replies.length - 1].date : discussion.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Ответов</span>
                  <span>{discussion.replies}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Просмотров</span>
                  <span>{discussion.views}</span>
                </div>
              </div>
            </div>

            {/* Похожие обсуждения */}
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold mb-4 text-white">Похожие обсуждения</h3>
              <div className="space-y-4">
                <Link to="#" className="block hover:bg-[#333333] p-2 rounded">
                  <h4 className="font-medium mb-1 text-white">Настройка WAF для защиты от атак</h4>
                  <p className="text-sm text-gray-400">8 ответов • 2 дня назад</p>
                </Link>
                <Link to="#" className="block hover:bg-[#333333] p-2 rounded">
                  <h4 className="font-medium mb-1 text-white">Опыт использования Cloudflare</h4>
                  <p className="text-sm text-gray-400">15 ответов • 4 дня назад</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailsPage;