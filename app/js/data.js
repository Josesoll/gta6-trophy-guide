// Loads the trophy data file and holds the shared labels for kinds and grades.
export const KIND_OPTIONS = [
  { value: 'all', label: 'All kinds' },
  { value: 'story', label: 'Story' },
  { value: 'missable', label: 'Missable' },
  { value: 'collectibles', label: 'Collectibles' },
  { value: 'activities', label: 'Activities' },
  { value: 'online', label: 'Online' },
  { value: 'other', label: 'Other' },
];

export const GRADE_OPTIONS = [
  { value: 'all', label: 'All grades' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'bronze', label: 'Bronze' },
];

export function kindLabel(kind) {
  const labels = { story: 'Story', collectibles: 'Collectibles', activities: 'Activities', online: 'Online', other: 'Other' };
  return labels[kind] ?? kind;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('trophies data failed to load');
  const doc = await response.json();
  return Array.isArray(doc) ? doc : doc.trophies;
}

export function trophyByName(trophies, name) {
  return trophies.find((trophy) => trophy.name === name) ?? null;
}

export function splitGuideAndSources(guide) {
  const marker = ' Sources: ';
  const at = guide.indexOf(marker);
  if (at === -1) return { body: guide, sources: '' };
  return { body: guide.slice(0, at).trim(), sources: guide.slice(at + marker.length).trim() };
}

export function formatTarget(target) {
  return target >= 10000 ? '$' + target.toLocaleString('en-US') : String(target);
}
