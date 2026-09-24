import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PHASES, ALL_TOPICS, DEFAULT_PROJECTS } from '../data/roadmapData';
import {
  getTopicStatuses, setTopicStatus,
  getTopicNotes, setTopicNote,
  getProjects, saveProjects,
  getContent, saveContent,
  getDailyTasks, saveDailyTasks,
  getStreak, updateStreak,
  getTheme, saveTheme,
} from '../data/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setThemeState] = useState(() => getTheme());
  const [topicStatuses, setTopicStatuses] = useState(() => getTopicStatuses());
  const [topicNotes, setTopicNotes] = useState(() => getTopicNotes());
  const [projects, setProjectsState] = useState(() => getProjects(DEFAULT_PROJECTS));
  const [content, setContentState] = useState(() => getContent());
  const [dailyTasks, setDailyTasksState] = useState(() => getDailyTasks());
  const [streak, setStreak] = useState(() => getStreak());

  // Apply theme class to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      saveTheme(next);
      return next;
    });
  }, []);

  const updateTopicStatus = useCallback((topicId, status) => {
    setTopicStatuses(prev => {
      const next = { ...prev, [topicId]: status };
      setTopicStatus(topicId, status);
      return next;
    });
  }, []);

  const updateTopicNote = useCallback((topicId, note) => {
    setTopicNotes(prev => {
      const next = { ...prev, [topicId]: note };
      setTopicNote(topicId, note);
      return next;
    });
  }, []);

  const addProject = useCallback((project) => {
    setProjectsState(prev => {
      const next = [...prev, { ...project, id: `proj-${Date.now()}`, createdAt: new Date().toISOString() }];
      saveProjects(next);
      return next;
    });
  }, []);

  const updateProject = useCallback((id, updates) => {
    setProjectsState(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      saveProjects(next);
      return next;
    });
  }, []);

  const deleteProject = useCallback((id) => {
    setProjectsState(prev => {
      const next = prev.filter(p => p.id !== id);
      saveProjects(next);
      return next;
    });
  }, []);

  const addContent = useCallback((item) => {
    setContentState(prev => {
      const next = [...prev, { ...item, id: `cnt-${Date.now()}`, createdAt: new Date().toISOString() }];
      saveContent(next);
      return next;
    });
  }, []);

  const updateContent = useCallback((id, updates) => {
    setContentState(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      saveContent(next);
      return next;
    });
  }, []);

  const deleteContent = useCallback((id) => {
    setContentState(prev => {
      const next = prev.filter(c => c.id !== id);
      saveContent(next);
      return next;
    });
  }, []);

  const toggleDailyTask = useCallback((taskId) => {
    setDailyTasksState(prev => {
      const exists = prev.find(t => t.id === taskId);
      const next = exists
        ? prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        : [...prev, { id: taskId, done: true }];
      saveDailyTasks(next);
      // Update streak when a task is completed
      const newStreak = updateStreak();
      setStreak(newStreak);
      return next;
    });
  }, []);

  // Computed stats
  const completedTopics = ALL_TOPICS.filter(t => topicStatuses[t.id] === 'Completed').length;
  const inProgressTopics = ALL_TOPICS.filter(t => topicStatuses[t.id] === 'In Progress').length;
  const totalTopics = ALL_TOPICS.length;

  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const publishedContent = content.filter(c => c.status === 'Published').length;

  // Determine current phase
  const currentPhase = PHASES.find(phase =>
    phase.topics.some(t => topicStatuses[t.id] === 'In Progress')
  ) || PHASES.find(phase =>
    phase.topics.some(t => !topicStatuses[t.id] || topicStatuses[t.id] === 'Not Started')
  ) || PHASES[0];

  const phaseProgress = (phase) => {
    const done = phase.topics.filter(t => topicStatuses[t.id] === 'Completed').length;
    return Math.round((done / phase.topics.length) * 100);
  };

  const overallProgress = Math.round((completedTopics / totalTopics) * 100);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      topicStatuses, updateTopicStatus,
      topicNotes, updateTopicNote,
      projects, addProject, updateProject, deleteProject,
      content, addContent, updateContent, deleteContent,
      dailyTasks, toggleDailyTask,
      streak,
      // stats
      completedTopics, inProgressTopics, totalTopics,
      completedProjects, publishedContent,
      currentPhase, phaseProgress, overallProgress,
      PHASES, ALL_TOPICS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
