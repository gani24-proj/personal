// localStorage data layer – clean abstraction for future DB migration
const KEYS = {
  TOPIC_STATUSES: 'acj_topic_statuses',
  TOPIC_NOTES: 'acj_topic_notes',
  PROJECTS: 'acj_projects',
  CONTENT: 'acj_content',
  DAILY_TASKS: 'acj_daily_tasks',
  STREAK: 'acj_streak',
  THEME: 'acj_theme',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

// ─── Topic statuses ───────────────────────────────────────────────────────────
export function getTopicStatuses() {
  return load(KEYS.TOPIC_STATUSES, {});
}

export function setTopicStatus(topicId, status) {
  const map = getTopicStatuses();
  map[topicId] = status;
  save(KEYS.TOPIC_STATUSES, map);
}

// ─── Topic notes ─────────────────────────────────────────────────────────────
export function getTopicNotes() {
  return load(KEYS.TOPIC_NOTES, {});
}

export function setTopicNote(topicId, note) {
  const map = getTopicNotes();
  map[topicId] = note;
  save(KEYS.TOPIC_NOTES, map);
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export function getProjects(defaultProjects) {
  return load(KEYS.PROJECTS, defaultProjects);
}

export function saveProjects(projects) {
  save(KEYS.PROJECTS, projects);
}

// ─── Content ──────────────────────────────────────────────────────────────────
export function getContent() {
  return load(KEYS.CONTENT, []);
}

export function saveContent(content) {
  save(KEYS.CONTENT, content);
}

// ─── Daily tasks ──────────────────────────────────────────────────────────────
const todayKey = () => new Date().toISOString().slice(0, 10);

export function getDailyTasks() {
  const all = load(KEYS.DAILY_TASKS, {});
  return all[todayKey()] || [];
}

export function saveDailyTasks(tasks) {
  const all = load(KEYS.DAILY_TASKS, {});
  all[todayKey()] = tasks;
  save(KEYS.DAILY_TASKS, all);
}

// ─── Streak ───────────────────────────────────────────────────────────────────
export function getStreak() {
  return load(KEYS.STREAK, { count: 0, lastDate: null });
}

export function updateStreak() {
  const streak = getStreak();
  const today = todayKey();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const newCount = streak.lastDate === yesterdayKey ? streak.count + 1 : 1;
  const newStreak = { count: newCount, lastDate: today };
  save(KEYS.STREAK, newStreak);
  return newStreak;
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export function getTheme() {
  return load(KEYS.THEME, 'dark');
}

export function saveTheme(theme) {
  save(KEYS.THEME, theme);
}
