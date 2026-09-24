import { useApp } from '../context/AppContext';
import { getProgressColor } from '../utils/helpers';

function StatRow({ label, current, total, color }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{current}/{total} ({pct}%)</span>
      </div>
      <div className="progress-bar" style={{ height: '10px' }}>
        <div
          className={`progress-bar-fill ${color || getProgressColor(pct)}`}
          style={{ width: `${pct}%`, background: color ? undefined : undefined }}
        />
      </div>
    </div>
  );
}

export default function Progress() {
  const {
    PHASES, topicStatuses, phaseProgress,
    completedTopics, inProgressTopics, totalTopics,
    projects, content, streak,
    overallProgress, completedProjects, publishedContent,
  } = useApp();

  const completedProj = projects.filter(p => p.status === 'Completed').length;
  const activeProj = projects.filter(p => p.status === 'Building').length;

  const pubContent = content.filter(c => c.status === 'Published').length;
  const ytPub = content.filter(c => c.platform === 'YouTube' && c.status === 'Published').length;
  const igPub = content.filter(c => c.platform === 'Instagram' && c.status === 'Published').length;

  const inProgressTopicsList = Object.entries(topicStatuses)
    .filter(([, v]) => v === 'In Progress')
    .map(([id]) => PHASES.flatMap(p => p.topics).find(t => t.id === id))
    .filter(Boolean);

  const completedTopicsList = Object.entries(topicStatuses)
    .filter(([, v]) => v === 'Completed')
    .map(([id]) => PHASES.flatMap(p => p.topics).find(t => t.id === id))
    .filter(Boolean)
    .slice(-5) // last 5 completed
    .reverse();

  return (
    <div>
      <div className="page-header">
        <h2>Progress</h2>
        <p>A clear view of how far you've come</p>
      </div>

      {/* Top highlight cards */}
      <div className="grid-4 mb-4">
        <div className="card stat-card" style={{ borderTop: `3px solid var(--accent)` }}>
          <span className="stat-label">Overall</span>
          <span className="stat-value">{overallProgress}%</span>
          <span className="stat-sub">of the full year</span>
        </div>
        <div className="card stat-card" style={{ borderTop: `3px solid var(--success)` }}>
          <span className="stat-label">Topics Done</span>
          <span className="stat-value">{completedTopics}</span>
          <span className="stat-sub">out of {totalTopics}</span>
        </div>
        <div className="card stat-card" style={{ borderTop: `3px solid var(--warning)` }}>
          <span className="stat-label">Streak</span>
          <span className="stat-value">🔥 {streak.count}</span>
          <span className="stat-sub">{streak.count === 1 ? 'day' : 'days'} active</span>
        </div>
        <div className="card stat-card" style={{ borderTop: `3px solid var(--purple)` }}>
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{inProgressTopics}</span>
          <span className="stat-sub">topics active</span>
        </div>
      </div>

      <div className="grid-2 mb-4">
        {/* Learning progress */}
        <div className="card">
          <div className="section-title">Learning Progress — by Phase</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {PHASES.map(phase => {
              const pct = phaseProgress(phase);
              const done = phase.topics.filter(t => topicStatuses[t.id] === 'Completed').length;
              return (
                <div key={phase.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.83rem', fontWeight: 500 }}>
                      <span style={{ color: phase.color }}>●</span> Phase {phase.number}: {phase.title}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{done}/{phase.topics.length}</span>
                  </div>
                  <div className="progress-bar" style={{ height: '8px' }}>
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: phase.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project & content progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="section-title">Project Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <StatRow label="Completed" current={completedProj} total={projects.length} />
              <StatRow label="Active (Building)" current={activeProj} total={projects.length} />
            </div>
          </div>
          <div className="card">
            <div className="section-title">Content Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <StatRow label="Total Published" current={pubContent} total={content.length} />
              <StatRow label="YouTube Published" current={ytPub} total={content.filter(c => c.platform === 'YouTube').length} />
              <StatRow label="Instagram Published" current={igPub} total={content.filter(c => c.platform === 'Instagram').length} />
            </div>
          </div>
        </div>
      </div>

      {/* Currently learning */}
      {inProgressTopicsList.length > 0 && (
        <div className="card mb-4">
          <div className="section-title">Currently Learning</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {inProgressTopicsList.map(t => (
              <span key={t.id} style={{
                background: 'var(--warning-dim)', color: 'var(--warning)',
                borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.75rem',
                fontSize: '0.83rem', fontWeight: 500,
              }}>
                📖 {t.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recently completed */}
      {completedTopicsList.length > 0 && (
        <div className="card">
          <div className="section-title">Recently Completed</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {completedTopicsList.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.5rem 0.75rem', background: 'var(--success-dim)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{ color: 'var(--success)', fontSize: '1rem' }}>✓</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.name}</span>
                <span className="text-xs text-muted">Phase {t.phase}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedTopicsList.length === 0 && inProgressTopicsList.length === 0 && (
        <div className="card empty-state">
          <div className="empty-icon">🌱</div>
          <h3>Your journey starts here</h3>
          <p>Mark topics as "In Progress" or "Completed" in the Learn or Roadmap sections to see your progress grow.</p>
        </div>
      )}
    </div>
  );
}
