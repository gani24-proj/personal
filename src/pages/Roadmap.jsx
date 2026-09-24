import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getBadgeClass } from '../utils/helpers';
import { TOPIC_STATUSES } from '../data/roadmapData';

export default function Roadmap() {
  const { PHASES, topicStatuses, updateTopicStatus, phaseProgress } = useApp();
  const [expanded, setExpanded] = useState(PHASES[0].id);

  return (
    <div>
      <div className="page-header">
        <h2>Roadmap</h2>
        <p>Your complete 12-month AI/ML + Web Dev career roadmap</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {PHASES.map(phase => {
          const pct = phaseProgress(phase);
          const isOpen = expanded === phase.id;
          const completedCount = phase.topics.filter(t => topicStatuses[t.id] === 'Completed').length;

          return (
            <div
              key={phase.id}
              className="card phase-card"
              style={{ borderLeftColor: phase.color }}
            >
              {/* Phase header */}
              <button
                onClick={() => setExpanded(isOpen ? null : phase.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  width: '100%', background: 'none', color: 'var(--text)',
                  padding: '0', textAlign: 'left', borderRadius: 0,
                }}
              >
                <span style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: phase.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.9rem',
                }}>
                  {phase.number}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{phase.title}</span>
                    <span className="text-xs text-muted">{phase.period}</span>
                    <span className="badge badge-completed" style={{
                      background: 'transparent', color: phase.color, border: `1px solid ${phase.color}`
                    }}>
                      {completedCount}/{phase.topics.length} done
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: phase.color }} />
                    </div>
                    <span className="text-xs text-muted" style={{ flexShrink: 0 }}>{pct}%</span>
                  </div>
                </div>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Topic list */}
              {isOpen && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  {phase.topics.map(topic => {
                    const status = topicStatuses[topic.id] || 'Not Started';
                    return (
                      <div key={topic.id} className="topic-row">
                        <div
                          className={`topic-dot ${status === 'Completed' ? 'completed' : status === 'In Progress' ? 'in-progress' : ''}`}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{topic.name}</span>
                            <span className={`badge ${getBadgeClass(status)}`}>{status}</span>
                          </div>
                          <p className="text-xs text-muted mt-1">{topic.description}</p>
                        </div>
                        <select
                          value={status}
                          onChange={e => updateTopicStatus(topic.id, e.target.value)}
                          style={{ width: 'auto', flexShrink: 0, fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                          aria-label={`Status for ${topic.name}`}
                        >
                          {TOPIC_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
