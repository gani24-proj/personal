import { useState } from 'react';
import { useApp } from '../context/AppContext';

// Today's focus tasks (static suggestions based on current phase)
const FOCUS_SUGGESTIONS = {
  'phase-1': [
    'Practice Python functions and list comprehensions',
    'Commit your latest code to GitHub',
    'Build a small HTML/CSS layout',
    'Fetch data from a free public API',
  ],
  'phase-2': [
    'Explore a dataset with Pandas',
    'Build a regression model on housing data',
    'Create a visualisation with Seaborn',
    'Evaluate your model with cross-validation',
  ],
  'phase-3': [
    'Study transformer attention mechanisms',
    'Experiment with the OpenAI API',
    'Build a semantic search demo',
    'Read about RAG pipeline architecture',
  ],
  'phase-4': [
    'Build a React component with hooks',
    'Create a FastAPI endpoint',
    'Connect frontend to backend API',
    'Deploy your app to a free hosting service',
  ],
  'phase-5': [
    'Work on your major project frontend',
    'Write tests for your API routes',
    'Document a feature in the README',
    'Deploy the latest version of your app',
  ],
  'phase-6': [
    'Apply to 3 internship positions',
    'Record a project walkthrough video',
    'Improve your GitHub profile README',
    'Post content on YouTube/Instagram',
  ],
};

export default function Dashboard() {
  const {
    currentPhase, overallProgress, completedTopics, totalTopics,
    completedProjects, publishedContent, streak, projects, topicStatuses,
    dailyTasks, toggleDailyTask, PHASES, phaseProgress,
  } = useApp();

  const suggestions = FOCUS_SUGGESTIONS[currentPhase.id] || FOCUS_SUGGESTIONS['phase-1'];

  // Build today's task list from suggestions (using index as ID)
  const todayTasks = suggestions.map((text, i) => ({
    id: `${currentPhase.id}-task-${i}`,
    text,
  }));

  const activeProjct = projects.find(p => p.status === 'Building') || projects[0];
  const phaseCompletions = PHASES.map(p => phaseProgress(p));

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Your AI career journey at a glance — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Top stats */}
      <div className="grid-4 mb-4">
        <div className="card stat-card">
          <span className="stat-label">Overall Progress</span>
          <span className="stat-value">{overallProgress}%</span>
          <div className="progress-bar mt-1">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="stat-sub">{completedTopics}/{totalTopics} topics done</span>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Learning Streak</span>
          <span className="stat-value">🔥 {streak.count}</span>
          <span className="stat-sub">{streak.count === 1 ? 'day' : 'days'} in a row</span>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Projects</span>
          <span className="stat-value">{projects.length}</span>
          <span className="stat-sub">{completedProjects} completed</span>
        </div>

        <div className="card stat-card">
          <span className="stat-label">Content</span>
          <span className="stat-value">{publishedContent}</span>
          <span className="stat-sub">posts published</span>
        </div>
      </div>

      <div className="grid-2 mb-4" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
        {/* Current phase */}
        <div className="card">
          <div className="section-title">Current Phase</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: currentPhase.color }}>
              Phase {currentPhase.number}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentPhase.title}</span>
          </div>
          <p className="text-sm text-muted mb-2">{currentPhase.period}</p>
          <div className="progress-bar mb-1">
            <div className="progress-bar-fill" style={{ width: `${phaseCompletions[currentPhase.number - 1]}%`, background: currentPhase.color }} />
          </div>
          <span className="text-xs text-muted">{phaseCompletions[currentPhase.number - 1]}% complete</span>

          {activeProjct && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
              <div className="text-xs text-muted mb-1">CURRENT PROJECT</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activeProjct.name}</div>
              <div className="text-xs text-muted">{activeProjct.technology}</div>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill warning" style={{ width: `${activeProjct.progress}%` }} />
              </div>
              <div className="text-xs text-muted mt-1">{activeProjct.progress}% built</div>
            </div>
          )}
        </div>

        {/* Today's focus */}
        <div className="card">
          <div className="section-title">Today's Focus</div>
          <p className="text-xs text-muted mb-3">Check off what you complete today — it counts toward your streak!</p>
          {todayTasks.map(task => {
            const done = dailyTasks.find(t => t.id === task.id)?.done;
            return (
              <button
                key={task.id}
                onClick={() => toggleDailyTask(task.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                  width: '100%', padding: '0.6rem 0.75rem', marginBottom: '0.4rem',
                  background: done ? 'var(--success-dim)' : 'var(--surface-2)',
                  border: `1px solid ${done ? 'var(--success)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)', textAlign: 'left',
                  color: done ? 'var(--success)' : 'var(--text)',
                  fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{done ? '✅' : '⬜'}</span>
                <span style={{ textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.7 : 1 }}>
                  {task.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase overview */}
      <div className="card">
        <div className="section-title">Roadmap Overview</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {PHASES.map((phase, i) => (
            <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: phaseCompletions[i] === 100 ? phase.color : 'var(--surface-2)',
                border: `2px solid ${phase.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                color: phaseCompletions[i] === 100 ? '#fff' : phase.color,
              }}>
                {phaseCompletions[i] === 100 ? '✓' : i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{phase.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{phaseCompletions[i]}%</span>
                </div>
                <div className="progress-bar" style={{ height: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: `${phaseCompletions[i]}%`, background: phase.color }} />
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '70px', textAlign: 'right', flexShrink: 0 }}>
                {phase.period}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
