import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getBadgeClass, formatDate } from '../utils/helpers';
import { PROJECT_STATUSES } from '../data/roadmapData';

const EMPTY_FORM = {
  name: '', description: '', technology: '',
  status: 'Idea', progress: 0,
  githubUrl: '', liveUrl: '',
  learned: '', problems: '', nextStep: '', phase: '',
};

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project || { ...EMPTY_FORM });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{project ? 'Edit Project' : 'Add Project'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <label>Project Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="AI Language Tutor" required />
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="What does this project do?" rows={2} />
            </div>
            <div className="form-row">
              <label>Technology Stack</label>
              <input value={form.technology} onChange={e => set('technology', e.target.value)} placeholder="React, FastAPI, OpenAI API" />
            </div>
            <div className="form-grid-2">
              <div className="form-row">
                <label>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Progress ({form.progress}%)</label>
                <input type="range" min="0" max="100" value={form.progress}
                  onChange={e => set('progress', Number(e.target.value))}
                  style={{ padding: 0, background: 'transparent', border: 'none', boxShadow: 'none', cursor: 'pointer' }} />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-row">
                <label>GitHub URL</label>
                <input type="url" value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)} placeholder="https://github.com/…" />
              </div>
              <div className="form-row">
                <label>Live Demo URL</label>
                <input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://…" />
              </div>
            </div>
            <div className="form-row">
              <label>What I Learned</label>
              <textarea value={form.learned} onChange={e => set('learned', e.target.value)} placeholder="Key learnings from this project…" rows={2} />
            </div>
            <div className="form-row">
              <label>Problems / Challenges</label>
              <textarea value={form.problems} onChange={e => set('problems', e.target.value)} placeholder="What was hard? What broke?" rows={2} />
            </div>
            <div className="form-row">
              <label>Next Step</label>
              <input value={form.nextStep} onChange={e => set('nextStep', e.target.value)} placeholder="What are you working on next?" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{project.name}</h3>
            <span className={`badge ${getBadgeClass(project.status)}`}>{project.status}</span>
          </div>
          {project.technology && (
            <p className="text-xs text-muted mt-1">{project.technology}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
          <button className="btn btn-icon" onClick={onEdit} title="Edit">✏️</button>
          <button className="btn btn-icon" onClick={onDelete} title="Delete">🗑️</button>
        </div>
      </div>

      {project.description && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {project.description}
        </p>
      )}

      {/* Progress */}
      <div className="mb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <span className="text-xs text-muted">Progress</span>
          <span className="text-xs text-muted">{project.progress}%</span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-bar-fill ${project.progress === 100 ? 'success' : project.progress >= 60 ? '' : 'warning'}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Links */}
      {(project.githubUrl || project.liveUrl) && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
              🐙 GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
              🌐 Live Demo
            </a>
          )}
        </div>
      )}

      {/* Expandable details */}
      <button
        className="btn btn-ghost"
        style={{ fontSize: '0.8rem', padding: '0.3rem 0' }}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? '▲ Hide details' : '▼ Show details'}
      </button>

      {showDetails && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {project.learned && (
            <div style={{ background: 'var(--success-dim)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem' }}>
              <div className="text-xs font-bold" style={{ color: 'var(--success)', marginBottom: '0.2rem' }}>💡 What I Learned</div>
              <p className="text-sm">{project.learned}</p>
            </div>
          )}
          {project.problems && (
            <div style={{ background: 'var(--warning-dim)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem' }}>
              <div className="text-xs font-bold" style={{ color: 'var(--warning)', marginBottom: '0.2rem' }}>⚠️ Challenges</div>
              <p className="text-sm">{project.problems}</p>
            </div>
          )}
          {project.nextStep && (
            <div style={{ background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.75rem' }}>
              <div className="text-xs font-bold" style={{ color: 'var(--accent)', marginBottom: '0.2rem' }}>🎯 Next Step</div>
              <p className="text-sm">{project.nextStep}</p>
            </div>
          )}
          <p className="text-xs text-muted">Added {formatDate(project.createdAt)}</p>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useApp();
  const [modal, setModal] = useState(null); // null | 'add' | project-object
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all'
    ? projects
    : projects.filter(p => p.status === filterStatus);

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) deleteProject(id);
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Projects</h2>
            <p>Track everything you build — from idea to deployed</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('add')}>+ Add Project</button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['all', ...PROJECT_STATUSES].map(s => (
          <button
            key={s}
            className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterStatus(s)}
            style={{ fontSize: '0.8rem' }}
          >
            {s === 'all' ? `All (${projects.length})` : `${s} (${projects.filter(p => p.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <h3>No projects yet</h3>
          <p>Start by adding your first project</p>
          <button className="btn btn-primary mt-3" onClick={() => setModal('add')}>Add Project</button>
        </div>
      ) : (
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setModal(project)}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}

      {modal && (
        <ProjectModal
          project={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={(form) => {
            if (modal === 'add') addProject(form);
            else updateProject(modal.id, form);
          }}
        />
      )}
    </div>
  );
}
