import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-8">Страница не найдена</p>
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <Home className="h-5 w-5 mr-2" />
          На главную
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 