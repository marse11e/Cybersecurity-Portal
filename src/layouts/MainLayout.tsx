import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, User, LogIn, LogOut, ChevronDown } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  
  // Mock authentication state - in a real app, this would come from your auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
    // In a real app, you would call your logout function here
  };
  
  // For demo purposes only - toggle auth state
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-gray-100">
      {/* Шапка */}
      <header className="bg-[#222222] border-b border-[#333333]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Логотип */}
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-[#ffcc00]" />
              <span className="text-xl font-bold text-white">КиберГрамота</span>
            </Link>
            
            {/* Навигация для десктопа */}
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/" active={location.pathname === '/'}>Главная</NavLink>
              <NavLink to="/courses" active={location.pathname.startsWith('/courses')}>Курсы</NavLink>
              <NavLink to="/articles" active={location.pathname.startsWith('/articles')}>Статьи</NavLink>
              <NavLink to="/tests" active={location.pathname.startsWith('/tests')}>Тесты</NavLink>
              <NavLink to="/forum" active={location.pathname.startsWith('/forum')}>Форум</NavLink>
              {isAuthenticated && (
                <NavLink to="/admin" active={location.pathname.startsWith('/admin')}>Админ</NavLink>
              )}
            </nav>
            
            {/* Действия пользователя */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-300 hover:text-[#ffcc00] focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center">
                      <User className="h-5 w-5 text-[#ffcc00]" />
                    </div>
                    <span>Акбота</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {/* Выпадающее меню пользователя */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#222222] rounded-md shadow-lg py-1 z-10 border border-[#333333]">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-[#ffcc00]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Профиль
                      </Link>
                      <Link 
                        to="/profile/settings" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-[#ffcc00]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Настройки
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-[#ffcc00]"
                      >
                        Выйти
                      </button>
                      {/* Для демонстрации */}
                      <button 
                        onClick={toggleAuth}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] hover:text-[#ffcc00]"
                      >
                        (Демо: Переключить авторизацию)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-[#ffcc00] border border-[#333333] rounded-md hover:border-[#ffcc00] transition-colors">
                    <LogIn className="h-4 w-4 inline mr-2" />
                    <span>Войти</span>
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-[#ffcc00] text-black rounded-md hover:bg-[#ffd633] transition-colors">
                    <User className="h-4 w-4 inline mr-2" />
                    <span>Регистрация</span>
                  </Link>
                </>
              )}
            </div>
            
            {/* Кнопка мобильного меню */}
            <button 
              className="md:hidden text-gray-300 hover:text-[#ffcc00] focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Мобильная навигация */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#333333]">
              <nav className="flex flex-col space-y-4">
                <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Главная</MobileNavLink>
                <MobileNavLink to="/courses" onClick={() => setIsMenuOpen(false)}>Курсы</MobileNavLink>
                <MobileNavLink to="/articles" onClick={() => setIsMenuOpen(false)}>Статьи</MobileNavLink>
                <MobileNavLink to="/simulators" onClick={() => setIsMenuOpen(false)}>Симуляторы</MobileNavLink>
                <MobileNavLink to="/tests" onClick={() => setIsMenuOpen(false)}>Тесты</MobileNavLink>
                <MobileNavLink to="/forum" onClick={() => setIsMenuOpen(false)}>Форум</MobileNavLink>
                {isAuthenticated && (
                  <MobileNavLink to="/admin" onClick={() => setIsMenuOpen(false)}>Админ</MobileNavLink>
                )}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 text-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Профиль</span>
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-gray-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Выйти</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/login" 
                      className="btn btn-outline w-full justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Войти
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn btn-primary w-full justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Основной контент */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Подвал */}
      <footer className="bg-[#222222] text-gray-300 py-12 border-t border-[#333333]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Логотип и описание */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-gray-400" />
                <span className="text-xl font-bold">Кибер Грамота</span>
              </div>
              <p className="text-gray-400 mb-4">
                Развиваем профессионалов в сфере кибербезопасности
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Быстрые ссылки */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Главная</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white">Курсы</Link></li>
                <li><Link to="/articles" className="text-gray-400 hover:text-white">Статьи</Link></li>
                <li><Link to="/tests" className="text-gray-400 hover:text-white">Тесты</Link></li>
                <li><Link to="/forum" className="text-gray-400 hover:text-white">Форум</Link></li>
              </ul>
            </div>
            
            {/* Юридическая информация */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Документы</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Условия использования</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Политика конфиденциальности</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Политика cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Соответствие GDPR</a></li>
              </ul>
            </div>
            
            {/* Рассылка */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">Будьте в курсе</h3>
              <p className="text-gray-400 mb-4">Подпишитесь на нашу рассылку для получения последних новостей по кибербезопасности.</p>
              <form className="space-y-2">
                <div>
                  <input 
                    type="email" 
                    placeholder="Ваш email адрес" 
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Подписаться
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} КиберГрамота. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Desktop Navigation Link
const NavLink: React.FC<{ to: string; active: boolean; children: React.ReactNode }> = ({ 
  to, 
  active, 
  children 
}) => (
  <Link 
    to={to} 
    className={`text-sm font-medium transition-colors duration-200 ${
      active ? 'text-[#ffcc00]' : 'text-gray-300 hover:text-[#ffcc00]'
    }`}
  >
    {children}
  </Link>
);

// Mobile Navigation Link
const MobileNavLink: React.FC<{ to: string; onClick: () => void; children: React.ReactNode }> = ({ 
  to, 
  onClick, 
  children 
}) => (
  <Link 
    to={to} 
    className="text-gray-300 hover:text-[#ffcc00] font-medium"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default MainLayout;