import React, { ReactNode } from 'react';

// Заглушка для совместимости, теперь всё через Redux
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);

export const useAuth = () => {
  throw new Error('useAuth больше не используется. Используйте useSelector/useDispatch из Redux.');
}; 