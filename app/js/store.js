// Saves tracker progress in localStorage and exports / imports it as a JSON file.
export const PROGRESS_KEY = 'leonidaLegendProgressV1';

export function defaultProgress() {
  return { earned: [], counts: {}, hideSpoilers: true };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
      hideSpoilers: parsed.hideSpoilers !== false,
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function isEarned(progress, name) {
  return progress.earned.includes(name);
}

export function toggleEarned(progress, name) {
  const at = progress.earned.indexOf(name);
  if (at === -1) progress.earned.push(name);
  else progress.earned.splice(at, 1);
  saveProgress(progress);
}

export function setCount(progress, name, value) {
  const clean = Math.max(0, Math.floor(Number(value) || 0));
  progress.counts[name] = clean;
  saveProgress(progress);
  return clean;
}

export function getCount(progress, name) {
  return Number(progress.counts[name] || 0);
}

export function exportProgress(progress) {
  const payload = JSON.stringify({ app: 'leonida-legend', version: 1, ...progress }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = 'leonida-legend-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function importProgressFile(file) {
  const parsed = JSON.parse(await file.text());
  const earned = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(earned)) throw new Error('no earned list in file');
  return {
    earned: earned.filter((name) => typeof name === 'string'),
    counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
    hideSpoilers: parsed.hideSpoilers !== false,
  };
}
