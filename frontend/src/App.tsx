import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import './App.css';

interface User {
  token: string;
  userId: string;
}

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      setUser({ token, userId });
    }
  }, []);

  const handleLoginSuccess = (token: string) => {
    const userId = `user_${Date.now()}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    setUser({ token, userId });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <div className="app">
      {user ? (
        <ChatPage token={user.token} userId={user.userId} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
