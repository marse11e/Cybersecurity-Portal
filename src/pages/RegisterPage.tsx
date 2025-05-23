import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../api/services/auth.service';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [code, setCode] = useState('');
  const [emailForVerify, setEmailForVerify] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name
      });
      // После успешной регистрации отправляем код на email
      await authService.sendEmailCode(formData.email, 'register');
      setEmailForVerify(formData.email);
      setStep('verify');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.verifyEmailCode(emailForVerify, code, 'register');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Неверный или просроченный код.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Левая панель с информацией */}
      <div className="hidden md:block md:flex-1 bg-gradient-to-br from-[#ffcc00] to-[#ff9500] p-12 flex items-center justify-center">
        <div className="max-w-md text-black">
          <h2 className="text-3xl font-bold mb-6">Присоединяйтесь к нашему сообществу</h2>
          <p className="mb-8 text-lg">
            Получите доступ к лучшим курсам и материалам по кибербезопасности. Создайте аккаунт и начните свой путь к экспертизе в области защиты информации.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-white font-bold">1</span>
              </div>
              <p>Бесплатная регистрация и доступ к базовым материалам</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-white font-bold">2</span>
              </div>
              <p>Персональный трекинг прогресса обучения</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-white font-bold">3</span>
              </div>
              <p>Получайте сертификаты об окончании курсов</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Правая панель с формой регистрации или подтверждения кода */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="text-3xl font-bold text-[#ffcc00]">Cybersecurity</Link>
            <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              {step === 'register' ? 'Создать аккаунт' : 'Подтвердите email'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {step === 'register' ? 'Заполните форму для регистрации' : `Введите код, отправленный на ${emailForVerify}`}
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {step === 'register' ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00] focus:outline-none transition-colors"
                    placeholder="Иван"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00] focus:outline-none transition-colors"
                    placeholder="Петров"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00] focus:outline-none transition-colors"
                  placeholder="username"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Минимум 8 символов
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors focus:ring-4 focus:ring-[#ffcc00]/50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <div className="mb-6">
                <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Код подтверждения
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00] focus:outline-none transition-colors"
                  placeholder="Введите код из письма"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors focus:ring-4 focus:ring-[#ffcc00]/50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Проверка...' : 'Подтвердить'}
              </button>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-[#ffcc00] hover:underline"
                  onClick={async () => {
                    setLoading(true);
                    setError(null);
                    try {
                      await authService.sendEmailCode(emailForVerify, 'register');
                    } catch (err: any) {
                      setError('Ошибка при повторной отправке кода.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Отправить код повторно
                </button>
              </div>
            </form>
          )}
          {step === 'register' && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="font-medium text-[#ffcc00] hover:underline">
                  Войти
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;