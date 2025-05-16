import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    setTimeout(() => {
      console.log('Отправка инструкций по сбросу пароля на:', email);
      setIsLoading(false);
      setSuccess(true);
    }, 1000);
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
          Введите email, и мы отправим вам инструкции по сбросу пароля
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
          
          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Проверьте вашу почту
              </h3>
              <p className="text-gray-400 mb-6">
                Мы отправили инструкции по сбросу пароля на {email}
              </p>
              <Link 
                to="/login" 
                className="w-full bg-[#ffcc00] text-black hover:bg-[#ffd633] px-4 py-2 rounded-md font-medium transition-colors inline-block"
              >
                Вернуться к входу
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  {isLoading ? 'Отправка...' : 'Отправить инструкции'}
                </button>
              </div>
            </form>
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