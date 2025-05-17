import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../api/services/auth.service';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'success'>('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 1. Отправка email для получения кода
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authService.sendEmailCode(email, 'reset');
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке письма.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Подтверждение кода
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError('Введите код из письма');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authService.verifyEmailCode(email, code, 'reset');
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Неверный или просроченный код.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Сброс пароля
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Заполните оба поля');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 8) {
      setError('Пароль должен содержать не менее 8 символов');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authService.resetPasswordByCode(email, code, newPassword, confirmPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Ошибка при сбросе пароля.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-[#ffcc00]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Восстановление пароля
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {step === 'email' && 'Введите email, и мы отправим вам код для сброса пароля'}
          {step === 'code' && `Введите код, отправленный на ${email}`}
          {step === 'reset' && 'Придумайте новый пароль'}
          {step === 'success' && 'Пароль успешно изменён!'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#222222] py-8 px-4 border border-[#333333] sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          {step === 'email' && (
            <form className="space-y-6" onSubmit={handleSendEmail}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="mt-1 relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 bg-[#333333] border border-[#444444] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Отправка...' : 'Отправить код'}
                </button>
              </div>
            </form>
          )}
          {step === 'code' && (
            <form className="space-y-6" onSubmit={handleVerifyCode}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                  Код из письма
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="block w-full bg-[#333333] border border-[#444444] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
                  placeholder="Введите код"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Проверка...' : 'Подтвердить код'}
                </button>
              </div>
              <div className="text-center mt-2">
                <button
                  type="button"
                  className="text-sm text-[#ffcc00] hover:underline"
                  onClick={async () => {
                    setIsLoading(true);
                    setError('');
                    try {
                      await authService.sendEmailCode(email, 'reset');
                    } catch {
                      setError('Ошибка при повторной отправке кода.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Отправить код повторно
                </button>
              </div>
            </form>
          )}
          {step === 'reset' && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  Новый пароль
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="block w-full bg-[#333333] border border-[#444444] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">Минимум 8 символов</p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Подтвердите новый пароль
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="block w-full bg-[#333333] border border-[#444444] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00]"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Сброс...' : 'Сбросить пароль'}
                </button>
              </div>
            </form>
          )}
          {step === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Пароль успешно изменён
              </h3>
              <p className="text-gray-400 mb-6">
                Теперь вы можете войти с новым паролем
              </p>
              <Link 
                to="/login" 
                className="w-full bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors inline-block"
              >
                Вернуться к входу
              </Link>
            </div>
          )}

          <div className="mt-6">
            <Link 
              to="/login" 
              className="text-sm text-[#ffcc00] hover:text-[#ffd633] flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Вернуться к входу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;