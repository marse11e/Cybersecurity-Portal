import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../api/services/auth.service';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, введите email и пароль');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(email, password);
      console.log('Login successful', result);
      if (result.access) localStorage.setItem('token', result.access);
      if (result.refresh) localStorage.setItem('refresh', result.refresh);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Ошибка при входе. Проверьте email и пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Левая панель с формой входа */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="text-3xl font-bold text-[#ffcc00]">Cybersecurity</Link>
            <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Добро пожаловать!</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Введите данные для входа</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00] focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  Пароль
                </label>
                <Link to="/forgot-password" className="text-sm text-[#ffcc00] hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#ffcc00] focus:ring-[#ffcc00] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Запомнить меня
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors focus:ring-4 focus:ring-[#ffcc00]/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Еще нет аккаунта?{' '}
              <Link to="/register" className="font-medium text-[#ffcc00] hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Правая панель с информацией */}
      <div className="hidden md:block md:flex-1 bg-gradient-to-br from-[#ffcc00] to-[#ff9500] p-12 flex items-center justify-center">
        <div className="max-w-md text-black">
          <h2 className="text-3xl font-bold mb-6">Учебный портал по кибербезопасности</h2>
          <p className="mb-8 text-lg">
            Получите доступ к лучшим курсам и материалам по кибербезопасности. Развивайте навыки, проходите тесты и становитесь экспертом в области защиты информации.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-white font-bold">1</span>
              </div>
              <p>Интерактивные курсы по различным аспектам кибербезопасности</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-white font-bold">2</span>
              </div>
              <p>Практические задания и симуляции реальных угроз безопасности</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs text-white font-bold">3</span>
              </div>
              <p>Сертификаты об окончании курсов и достижения для вашего портфолио</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;