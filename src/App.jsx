import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar, { MobileHeader } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Learn from './pages/Learn';
import Projects from './pages/Projects';
import Content from './pages/Content';
import Progress from './pages/Progress';
import './index.css';

const PAGES = {
  dashboard: Dashboard,
  roadmap: Roadmap,
  learn: Learn,
  projects: Projects,
  content: Content,
  progress: Progress,
};

function AppShell() {
  const { theme, toggleTheme } = useApp();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="app-layout">
      <MobileHeader
        activePage={activePage}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        className={sidebarOpen ? 'open' : ''}
      />

      <main className="main-content">
        <PageComponent />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
