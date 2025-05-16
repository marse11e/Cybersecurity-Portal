import React, { useState, useEffect } from 'react';
import { User, UserAchievement, UserActivity } from '../api/types';
import { userService } from '../api/services/user.service';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Edit2, 
  FileText, 
  Lock, 
  LogOut,
  User as UserIcon, 
  Shield, 
  Star 
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'activities' | 'achievements' | 'security'>('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для формы редактирования профиля
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  
  // Состояние для формы смены пароля
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Получаем ID текущего пользователя (в реальном приложении это может приходить из состояния аутентификации)
        const userData = await userService.getUser(1); // Предполагаем, что у текущего пользователя ID = 1
        setUser(userData);
        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email
        });
        
        // Загружаем активности пользователя
        const activitiesData = await userService.getUserActivities(userData.id);
        setActivities(activitiesData);
        
        // Загружаем достижения пользователя
        const achievementsData = await userService.getUserAchievements(userData.id);
        setAchievements(achievementsData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const updatedUser = await userService.updateUserProfile(formData);
      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Не удалось обновить профиль');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    if (passwordForm.new_password.length < 8) {
      setPasswordError('Новый пароль должен содержать минимум 8 символов');
      return;
    }
    
    try {
      await userService.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      });
      
      setPasswordSuccess('Пароль успешно изменен');
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError('Не удалось изменить пароль. Проверьте текущий пароль и попробуйте снова.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Загрузка профиля...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-red-500">{error || 'Пользователь не найден'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Сайдбар */}
          <aside className="lg:col-span-1">
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative">
                  <img 
                    src={user.image || "https://via.placeholder.com/100"} 
                    alt={user.first_name} 
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <span className="absolute bottom-4 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-[#222222]"></span>
                </div>
                <h2 className="text-xl font-bold text-white">{user.first_name} {user.last_name}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
              
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'profile' ? 'bg-[#ffcc00] text-black' : 'text-gray-300 hover:bg-[#333333]'
                      }`}
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      Мой профиль
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('activities')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'activities' ? 'bg-[#ffcc00] text-black' : 'text-gray-300 hover:bg-[#333333]'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mr-3" />
                      Активность
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('achievements')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'achievements' ? 'bg-[#ffcc00] text-black' : 'text-gray-300 hover:bg-[#333333]'
                      }`}
                    >
                      <Award className="h-5 w-5 mr-3" />
                      Достижения
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'security' ? 'bg-[#ffcc00] text-black' : 'text-gray-300 hover:bg-[#333333]'
                      }`}
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      Безопасность
              </button>
                  </li>
                </ul>
              </nav>
              
              <div className="mt-8 pt-6 border-t border-[#333333]">
                <button className="w-full flex items-center justify-center px-4 py-2 text-red-400 hover:text-red-300 rounded-md hover:bg-[#333333]">
                  <LogOut className="h-5 w-5 mr-2" />
                Выйти
              </button>
            </div>
          </div>
          
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Статистика</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Курсы завершено</span>
                  <span className="text-white font-medium">{user.courses_completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Тесты пройдено</span>
                  <span className="text-white font-medium">{user.tests_completed || 0}</span>
            </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Статей прочитано</span>
                  <span className="text-white font-medium">{user.articles_read || 0}</span>
            </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Средний балл</span>
                  <span className="text-white font-medium">{user.average_score || 0}%</span>
            </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Дата регистрации</span>
                  <span className="text-white font-medium">{user.date_joined || 'Н/Д'}</span>
            </div>
          </div>
        </div>
          </aside>
          
          {/* Основной контент */}
          <main className="lg:col-span-3">
            {activeTab === 'profile' && (
            <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
              <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold text-white">Личная информация</h1>
                  {!editMode && (
                    <button 
                      onClick={() => setEditMode(true)}
                      className="flex items-center text-[#ffcc00] hover:text-[#ffd633]"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Редактировать
                    </button>
                  )}
              </div>
              
                {editMode ? (
                  <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Имя</label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md bg-[#333333] border border-[#444444] text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Фамилия</label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md bg-[#333333] border border-[#444444] text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md bg-[#333333] border border-[#444444] text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 rounded-md bg-[#333333] text-gray-300 hover:bg-[#444444]"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-[#ffcc00] text-black hover:bg-[#ffd633]"
                      >
                        Сохранить
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Имя</h3>
                        <p className="text-white">{user.first_name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Фамилия</h3>
                        <p className="text-white">{user.last_name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                        <p className="text-white">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Имя пользователя</h3>
                        <p className="text-white">{user.username}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'activities' && (
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                <h1 className="text-xl font-bold text-white mb-6">Активность</h1>
                
                {activities.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#333333]"></div>
                    <div className="space-y-6">
                      {activities.map((activity, index) => (
                        <div key={index} className="relative pl-10">
                          <div className="absolute left-0 w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center border-4 border-[#222222]">
                            {activity.type === 'course' && <BookOpen className="h-4 w-4 text-[#ffcc00]" />}
                            {activity.type === 'test' && <FileText className="h-4 w-4 text-[#ffcc00]" />}
                            {activity.type === 'article' && <FileText className="h-4 w-4 text-[#ffcc00]" />}
                            {activity.type === 'achievement' && <Award className="h-4 w-4 text-[#ffcc00]" />}
                          </div>
                          <div className="bg-[#2a2a2a] rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-white font-medium">{activity.title}</h3>
                              <span className="text-sm text-gray-400">{activity.date}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Нет активности</h3>
                    <p className="text-gray-400">
                      Начните изучать курсы и проходить тесты, чтобы отслеживать свою активность.
                    </p>
                  </div>
                )}
                      </div>
                    )}
                    
            {activeTab === 'achievements' && (
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                <h1 className="text-xl font-bold text-white mb-6">Достижения</h1>
                
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="bg-[#2a2a2a] rounded-lg p-4 flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${achievement.unlocked ? 'bg-[#ffcc00]/20' : 'bg-[#333333]'}`}>
                          {achievement.unlocked ? (
                            <Star className="h-6 w-6 text-[#ffcc00]" />
                          ) : (
                            <Lock className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                          {achievement.unlocked && (
                            <p className="text-xs text-[#ffcc00] mt-1">Получено {achievement.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Нет достижений</h3>
                    <p className="text-gray-400">
                      Проходите курсы и тесты, чтобы получать достижения.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="bg-[#222222] rounded-lg border border-[#333333] p-6">
                <h1 className="text-xl font-bold text-white mb-6">Безопасность</h1>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-white mb-4">Изменить пароль</h2>
                  
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-400 rounded">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-700 text-green-400 rounded">
                      {passwordSuccess}
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Текущий пароль</label>
                      <input
                        type="password"
                        name="old_password"
                        value={passwordForm.old_password}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 rounded-md bg-[#333333] border border-[#444444] text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                        required
                      />
            </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Новый пароль</label>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordForm.new_password}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 rounded-md bg-[#333333] border border-[#444444] text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">Минимум 8 символов</p>
          </div>
          
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-1">Подтвердите новый пароль</label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={passwordForm.confirm_password}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 rounded-md bg-[#333333] border border-[#444444] text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                        required
                      />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-[#ffcc00] text-black hover:bg-[#ffd633]"
                      >
                        Обновить пароль
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="pt-6 border-t border-[#333333]">
                  <h2 className="text-lg font-medium text-white mb-4">Сессии</h2>
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">Текущая сессия</h3>
                        <p className="text-sm text-gray-400">Устройство: Chrome на Windows</p>
                        <p className="text-sm text-gray-400">IP: 192.168.1.X • Время входа: Сегодня, 14:30</p>
                      </div>
                      <span className="bg-green-500 px-2 py-1 rounded-full text-xs text-white">Активна</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;