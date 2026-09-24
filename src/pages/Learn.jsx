import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getBadgeClass } from '../utils/helpers';
import { TOPIC_STATUSES } from '../data/roadmapData';

const LEARNING_FLOW = ['Real-World Problem', 'Explanation', 'Example', 'Practice', 'Build', 'Explain'];

export default function Learn() {
  const { PHASES, ALL_TOPICS, topicStatuses, updateTopicStatus, topicNotes, updateTopicNote } = useApp();
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [noteText, setNoteText] = useState('');

  const filteredTopics = useMemo(() => {
    return ALL_TOPICS.filter(t => {
      const phaseMatch = selectedPhase === 'all' || t.phase === parseInt(selectedPhase);
      const status = topicStatuses[t.id] || 'Not Started';
      const statusMatch = selectedStatus === 'all' || status === selectedStatus;
      const searchMatch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      return phaseMatch && statusMatch && searchMatch;
    });
  }, [ALL_TOPICS, selectedPhase, selectedStatus, search, topicStatuses]);

  const openTopic = (topic) => {
    setSelectedTopic(topic);
    setNoteText(topicNotes[topic.id] || '');
  };

  const closeTopic = () => {
    if (selectedTopic) {
      updateTopicNote(selectedTopic.id, noteText);
    }
    setSelectedTopic(null);
  };

  const saveNote = () => {
    if (selectedTopic) updateTopicNote(selectedTopic.id, noteText);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Learn</h2>
        <p>Track your learning progress across all topics</p>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label>Search</label>
            <input
              type="text"
              placeholder="Search topics…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label>Phase</label>
            <select value={selectedPhase} onChange={e => setSelectedPhase(e.target.value)}>
              <option value="all">All Phases</option>
              {PHASES.map(p => (
                <option key={p.id} value={p.number}>Phase {p.number} — {p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              {TOPIC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setSelectedPhase('all'); setSelectedStatus('all'); }}>
            Reset
          </button>
        </div>
      </div>

      {/* Topic cards grouped by phase */}
      {filteredTopics.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No topics found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        (() => {
          // Group by phase
          const grouped = {};
          filteredTopics.forEach(t => {
            if (!grouped[t.phase]) grouped[t.phase] = [];
            grouped[t.phase].push(t);
          });
          return Object.entries(grouped).map(([phaseNum, topics]) => {
            const phase = PHASES[parseInt(phaseNum) - 1];
            return (
              <div key={phaseNum} className="mb-4">
                <div className="section-title" style={{ color: phase.color }}>
                  Phase {phaseNum} — {phase.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {topics.map(topic => {
                    const status = topicStatuses[topic.id] || 'Not Started';
                    const note = topicNotes[topic.id];
                    return (
                      <div
                        key={topic.id}
                        className="card card-sm"
                        style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                        onClick={() => openTopic(topic)}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 0 2px ${phase.color}40`}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            className={`topic-dot ${status === 'Completed' ? 'completed' : status === 'In Progress' ? 'in-progress' : ''}`}
                            style={{ flexShrink: 0, marginTop: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{topic.name}</span>
                              <span className={`badge ${getBadgeClass(status)}`}>{status}</span>
                              {note && <span className="text-xs text-muted">📝</span>}
                            </div>
                            <p className="text-xs text-muted">{topic.description}</p>
                          </div>
                          <select
                            value={status}
                            onChange={e => { e.stopPropagation(); updateTopicStatus(topic.id, e.target.value); }}
                            onClick={e => e.stopPropagation()}
                            style={{ width: 'auto', flexShrink: 0, fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                            aria-label={`Status for ${topic.name}`}
                          >
                            {TOPIC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        })()
      )}

      {/* Topic detail modal */}
      {selectedTopic && (
        <div className="modal-overlay" onClick={closeTopic}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTopic.name}</h3>
              <button className="modal-close" onClick={closeTopic}>✕</button>
            </div>
            <div className="modal-body">
              {/* Status selector */}
              <div className="form-row">
                <label>Status</label>
                <select
                  value={topicStatuses[selectedTopic.id] || 'Not Started'}
                  onChange={e => updateTopicStatus(selectedTopic.id, e.target.value)}
                >
                  {TOPIC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Info blocks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {[
                  { label: '📖 Description', text: selectedTopic.description },
                  { label: '💡 Why It Matters', text: selectedTopic.why },
                  { label: '🌍 Real-World Example', text: selectedTopic.example },
                ].map(({ label, text }) => (
                  <div key={label} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                    <div className="text-xs font-bold text-muted mb-1">{label}</div>
                    <p style={{ fontSize: '0.875rem' }}>{text}</p>
                  </div>
                ))}
              </div>

              {/* Learning flow */}
              <div className="mb-3">
                <div className="section-title">Learning Flow</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {LEARNING_FLOW.map((step, i) => (
                    <span key={step} style={{
                      background: 'var(--accent-dim)', color: 'var(--accent)',
                      borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.6rem',
                      fontSize: '0.78rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}>
                      <span style={{ opacity: 0.7 }}>{i + 1}.</span> {step}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="form-row">
                <label>My Notes</label>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Write your notes, key insights, or questions here…"
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeTopic}>Close</button>
              <button className="btn btn-primary" onClick={() => { saveNote(); closeTopic(); }}>Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
