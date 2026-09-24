import { useState } from 'react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'roadmap',   label: 'Roadmap',   icon: '🗺️' },
  { id: 'learn',     label: 'Learn',     icon: '📚' },
  { id: 'projects',  label: 'Projects',  icon: '🚀' },
  { id: 'content',   label: 'Content',   icon: '🎬' },
  { id: 'progress',  label: 'Progress',  icon: '📊' },
];

export default function Sidebar({ activePage, onNavigate, className = '' }) {
  const { theme, toggleTheme } = useApp();

  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-logo">
        <h1>⚡ AI Career Journey</h1>
        <p>1-Year Roadmap Tracker</p>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="text-xs text-muted">v1.0.0</span>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </aside>
  );
}

export function MobileHeader({ activePage, onToggleSidebar, theme, toggleTheme }) {
  const current = NAV_ITEMS.find(n => n.id === activePage);
  return (
    <header className="mobile-header">
      <button className="hamburger" onClick={onToggleSidebar} aria-label="Toggle navigation">☰</button>
      <h1>{current?.icon} {current?.label || 'AI Career Journey'}</h1>
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
