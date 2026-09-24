import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getBadgeClass, formatDate } from '../utils/helpers';
import { CONTENT_STATUSES, PLATFORMS } from '../data/roadmapData';

const EMPTY_FORM = {
  title: '', platform: 'YouTube', topic: '',
  relatedProject: '', status: 'Idea',
  publishDate: '', url: '', notes: '',
};

function ContentModal({ item, projects, onClose, onSave }) {
  const [form, setForm] = useState(item || { ...EMPTY_FORM });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{item ? 'Edit Content' : 'Add Content'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <label>Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="How I Built an AI Language Tutor" required />
            </div>
            <div className="form-grid-2">
              <div className="form-row">
                <label>Platform</label>
                <select value={form.platform} onChange={e => set('platform', e.target.value)}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  {CONTENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <label>Topic</label>
              <input value={form.topic} onChange={e => set('topic', e.target.value)} placeholder="Python tutorial, ML project walkthrough…" />
            </div>
            <div className="form-grid-2">
              <div className="form-row">
                <label>Related Project</label>
                <select value={form.relatedProject} onChange={e => set('relatedProject', e.target.value)}>
                  <option value="">None</option>
                  {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Publish Date</label>
                <input type="date" value={form.publishDate} onChange={e => set('publishDate', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <label>URL</label>
              <input type="url" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://youtube.com/…" />
            </div>
            <div className="form-row">
              <label>Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Ideas, script notes, tags…" rows={2} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Content() {
  const { content, addContent, updateContent, deleteContent, projects } = useApp();
  const [modal, setModal] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return content.filter(c => {
      const pMatch = filterPlatform === 'all' || c.platform === filterPlatform;
      const sMatch = filterStatus === 'all' || c.status === filterStatus;
      const qMatch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || (c.topic || '').toLowerCase().includes(search.toLowerCase());
      return pMatch && sMatch && qMatch;
    });
  }, [content, filterPlatform, filterStatus, search]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this content item?')) deleteContent(id);
  };

  const ytCount = content.filter(c => c.platform === 'YouTube').length;
  const igCount = content.filter(c => c.platform === 'Instagram').length;
  const published = content.filter(c => c.status === 'Published').length;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Content</h2>
            <p>Manage your YouTube and Instagram content pipeline</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('add')}>+ Add Content</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-3 mb-4">
        <div className="card stat-card">
          <span className="stat-label">YouTube</span>
          <span className="stat-value" style={{ color: '#ff4444' }}>{ytCount}</span>
          <span className="stat-sub">total items</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Instagram</span>
          <span className="stat-value" style={{ color: '#e1306c' }}>{igCount}</span>
          <span className="stat-sub">total items</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Published</span>
          <span className="stat-value" style={{ color: 'var(--success)' }}>{published}</span>
          <span className="stat-sub">out of {content.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label>Search</label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or topic…" />
          </div>
          <div>
            <label>Platform</label>
            <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}>
              <option value="all">All Platforms</option>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              {CONTENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setFilterPlatform('all'); setFilterStatus('all'); }}>Reset</button>
        </div>
      </div>

      {/* Content list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>No content yet</h3>
          <p>Start planning your first YouTube or Instagram post</p>
          <button className="btn btn-primary mt-3" onClick={() => setModal('add')}>Add Content</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(item => (
            <div key={item.id} className="card card-sm">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</span>
                    <span className={`badge badge-${item.platform.toLowerCase()}`}>{item.platform}</span>
                    <span className={`badge ${getBadgeClass(item.status)}`}>{item.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                    {item.topic && <span className="text-xs text-muted">🏷️ {item.topic}</span>}
                    {item.relatedProject && <span className="text-xs text-muted">🔗 {item.relatedProject}</span>}
                    {item.publishDate && <span className="text-xs text-muted">📅 {item.publishDate}</span>}
                  </div>
                  {item.notes && <p className="text-xs text-muted mt-1">📝 {item.notes}</p>}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-xs" style={{ marginTop: '0.3rem', display: 'inline-block' }}>
                      🔗 View
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button className="btn btn-icon" onClick={() => setModal(item)} title="Edit">✏️</button>
                  <button className="btn btn-icon" onClick={() => handleDelete(item.id)} title="Delete">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ContentModal
          item={modal === 'add' ? null : modal}
          projects={projects}
          onClose={() => setModal(null)}
          onSave={(form) => {
            if (modal === 'add') addContent(form);
            else updateContent(modal.id, form);
          }}
        />
      )}
    </div>
  );
}
