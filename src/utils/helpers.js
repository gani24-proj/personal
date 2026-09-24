export function getBadgeClass(status) {
  if (!status) return 'badge-not-started';
  return 'badge-' + status.toLowerCase().replace(/\s+/g, '-');
}

export function getProgressColor(pct) {
  if (pct >= 80) return 'success';
  if (pct >= 40) return '';
  return 'warning';
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
