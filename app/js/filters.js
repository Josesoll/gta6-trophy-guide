// Pure filtering for the checklist: search text, kind, grade and earned state,
// plus the spoiler rule that hides unearned story trophies.
export function emptyFilterState() {
  return { query: '', kind: 'all', grade: 'all', earned: 'all' };
}

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  return trophy.kind === kind;
}

export function matchesQuery(trophy, query) {
  if (!query) return true;
  const haystack = (trophy.name + ' ' + trophy.description + ' ' + trophy.guide).toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function filterTrophies(trophies, filters, progress) {
  return trophies.filter((trophy) => {
    if (!matchesKind(trophy, filters.kind)) return false;
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (!matchesQuery(trophy, filters.query)) return false;
    if (filters.earned === 'earned' && !progress.earned.includes(trophy.name)) return false;
    if (filters.earned === 'unearned' && progress.earned.includes(trophy.name)) return false;
    return true;
  });
}

export function isSpoilerHidden(trophy, progress) {
  return progress.hideSpoilers === true
    && trophy.kind === 'story'
    && !progress.earned.includes(trophy.name);
}

export function visibleName(trophy, progress) {
  return isSpoilerHidden(trophy, progress) ? 'Hidden story trophy' : trophy.name;
}

export function visibleDescription(trophy, progress) {
  return isSpoilerHidden(trophy, progress)
    ? 'Spoiler hidden until earned. Turn off spoiler protection to reveal it.'
    : trophy.description;
}
