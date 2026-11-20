// Renders the checklist of trophy cards and the guide panel beside it.
import { gradeLabel, kindLabel, splitGuideAndSources, formatTarget } from './data.js';
import { isEarned, getCount } from './store.js';
import { isSpoilerHidden, visibleName, visibleDescription } from './filters.js';

function makeBadge(text, className) {
  const badge = document.createElement('span');
  badge.className = 'badge ' + className;
  badge.textContent = text;
  return badge;
}

function buildCounterRow(trophy, progress, onCount) {
  const row = document.createElement('div');
  row.className = 'counter-row';
  const label = document.createElement('span');
  const current = getCount(progress, trophy.name);
  label.textContent = 'Progress: ' + current.toLocaleString('en-US') + ' / ' + formatTarget(trophy.target) + ' ' + (trophy.unit ?? '');
  const minus = document.createElement('button');
  minus.type = 'button';
  minus.textContent = '−';
  minus.setAttribute('aria-label', 'Decrease count for ' + trophy.name);
  const plus = document.createElement('button');
  plus.type = 'button';
  plus.textContent = '+';
  plus.setAttribute('aria-label', 'Increase count for ' + trophy.name);
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.value = String(current);
  input.setAttribute('aria-label', 'Count for ' + trophy.name);
  minus.addEventListener('click', (event) => { event.stopPropagation(); onCount(trophy.name, current - 1); });
  plus.addEventListener('click', (event) => { event.stopPropagation(); onCount(trophy.name, current + 1); });
  input.addEventListener('click', (event) => event.stopPropagation());
  input.addEventListener('change', () => onCount(trophy.name, input.value));
  row.append(label, minus, input, plus);
  return row;
}

function buildTrophyCard(trophy, ctx) {
  const { progress, selectedName, onToggle, onSelect, onCount } = ctx;
  const earned = isEarned(progress, trophy.name);
  const hidden = isSpoilerHidden(trophy, progress);
  const card = document.createElement('div');
  card.className = 'trophy-card' + (earned ? ' is-earned' : '') + (selectedName === trophy.name ? ' is-selected' : '');
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned;
  box.setAttribute('aria-label', 'Mark ' + trophy.name + ' as earned');
  box.addEventListener('click', (event) => event.stopPropagation());
  box.addEventListener('change', () => onToggle(trophy.name));
  const body = document.createElement('div');
  if (hidden) body.classList.add('spoiler-hidden');
  const name = document.createElement('span');
  name.className = 'trophy-name';
  name.textContent = visibleName(trophy, progress);
  const desc = document.createElement('span');
  desc.className = 'trophy-desc';
  desc.textContent = visibleDescription(trophy, progress);
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.append(makeBadge(gradeLabel(trophy.grade), 'badge-grade-' + trophy.grade));
  meta.append(makeBadge(kindLabel(trophy.kind), 'badge-kind'));
  if (trophy.missable) meta.append(makeBadge('Missable', 'badge-missable'));
  if (earned) meta.append(makeBadge('Earned', 'badge-earned'));
  body.append(name, desc, meta);
  if (typeof trophy.target === 'number') body.append(buildCounterRow(trophy, progress, onCount));
  const open = document.createElement('span');
  open.className = 'badge badge-kind';
  open.textContent = 'Guide ›';
  card.append(box, body, open);
  card.addEventListener('click', () => onSelect(trophy.name));
  card.addEventListener('keydown', (event) => { if (event.key === 'Enter') onSelect(trophy.name); });
  return card;
}

export function renderGuidePanel(panel, trophy, progress) {
  panel.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.textContent = 'Select a trophy to read its guide, its missable warning and its sources.';
    panel.append(empty);
    return;
  }
  const wrap = document.createElement('div');
  wrap.className = 'guide-panel-wrap';
  const hidden = isSpoilerHidden(trophy, progress);
  const title = document.createElement('h2');
  title.textContent = visibleName(trophy, progress);
  const desc = document.createElement('p');
  desc.textContent = visibleDescription(trophy, progress);
  if (hidden) desc.className = 'spoiler-veil';
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.append(makeBadge(gradeLabel(trophy.grade), 'badge-grade-' + trophy.grade));
  meta.append(makeBadge(kindLabel(trophy.kind), 'badge-kind'));
  if (trophy.missable) meta.append(makeBadge('Missable', 'badge-missable'));
  if (isEarned(progress, trophy.name)) meta.append(makeBadge('Earned', 'badge-earned'));
  wrap.append(title, desc, meta);
  if (trophy.missable && trophy.missableNote) {
    const noteTitle = document.createElement('h3');
    noteTitle.textContent = 'When it can be missed';
    const note = document.createElement('p');
    note.className = 'missable-note';
    note.textContent = trophy.missableNote;
    wrap.append(noteTitle, note);
  }
  const { body, sources } = splitGuideAndSources(trophy.guide);
  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'Guide — in our own words';
  const guideText = document.createElement('p');
  guideText.textContent = hidden ? 'Spoiler hidden until earned. Turn off spoiler protection to read this guide.' : body;
  wrap.append(guideTitle, guideText);
  if (sources) {
    const sourcesTitle = document.createElement('h3');
    sourcesTitle.textContent = 'Sources';
    const sourcesText = document.createElement('p');
    sourcesText.textContent = sources;
    wrap.append(sourcesTitle, sourcesText);
  }
  if (typeof trophy.target === 'number') {
    const targetTitle = document.createElement('h3');
    targetTitle.textContent = 'Target';
    const targetText = document.createElement('p');
    targetText.textContent = getCount(progress, trophy.name).toLocaleString('en-US') + ' / ' + formatTarget(trophy.target) + ' ' + (trophy.unit ?? '') + ' — update the counter on the checklist card.';
    wrap.append(targetTitle, targetText);
  }
  panel.append(wrap);
}

export function renderChecklist(container, ctx) {
  container.replaceChildren();
  const layout = document.createElement('div');
  layout.className = 'checklist-layout';
  const list = document.createElement('ul');
  list.className = 'trophy-list';
  if (ctx.trophies.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = ctx.emptyMessage ?? 'No trophies match these filters.';
    list.append(empty);
  }
  for (const trophy of ctx.trophies) {
    const item = document.createElement('li');
    item.append(buildTrophyCard(trophy, ctx));
    list.append(item);
  }
  const panel = document.createElement('aside');
  panel.className = 'guide-panel';
  panel.id = 'guidePanel';
  const selected = ctx.trophies.find((trophy) => trophy.name === ctx.selectedName)
    ?? ctx.allTrophies.find((trophy) => trophy.name === ctx.selectedName)
    ?? null;
  renderGuidePanel(panel, selected, ctx.progress);
  layout.append(list, panel);
  container.append(layout);
}
