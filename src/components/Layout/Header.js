import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'ホーム', icon: '🏠' },
    { path: '/game', label: 'ゲーム', icon: '🎮' },
    { path: '/settings', label: '設定', icon: '⚙️' },
    { path: '/stats', label: '統計', icon: '📊' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">⌨️</span>
          TypoMaster
        </h1>
        
        <nav className="nav">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              className={`nav-btn ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;