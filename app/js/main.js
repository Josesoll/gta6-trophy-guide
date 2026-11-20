// Leonida Legend — wires the tracker together: loads the trophies, restores
// progress, and renders the checklist, roadmap and missables views.
import { loadTrophies, KIND_OPTIONS, GRADE_OPTIONS } from './data.js';
import { loadProgress, saveProgress, toggleEarned, setCount, exportProgress, importProgressFile } from './store.js';
import { emptyFilterState, filterTrophies } from './filters.js';
import { renderChecklist } from './views-checklist.js';
import { renderRoadmap } from './views-roadmap.js';
import { renderMissables } from './views-missables.js';

const state = {
  trophies: [],
  progress: loadProgress(),
  filters: emptyFilterState(),
  view: 'checklist',
  selectedName: null,
};

function el(id) { return document.getElementById(id); }

function updateHeader() {
  const total = state.trophies.length;
  const earned = state.progress.earned.filter((name) => state.trophies.some((t) => t.name === name)).length;
  el('progressText').textContent = earned + ' of ' + total + ' earned';
  el('progressFill').style.width = total ? Math.round((earned / total) * 100) + '%' : '0%';
  const tally = ['platinum', 'gold', 'silver', 'bronze'].map((grade) => {
    const inGrade = state.trophies.filter((t) => t.grade === grade);
    const got = inGrade.filter((t) => state.progress.earned.includes(t.name)).length;
    return grade + ' ' + got + '/' + inGrade.length;
  });
  el('gradeTally').textContent = tally.join(' · ');
}

function currentList() {
  const filtered = filterTrophies(state.trophies, state.filters, state.progress);
  if (state.filters.kind === 'online' && filtered.length === 0) return filtered;
  return filtered;
}

function emptyMessageFor() {
  if (state.filters.kind === 'online') {
    return 'The official PlayStation 5 list for GTA VI contains no online trophies: all 55 are earned in the single-player game. This filter stays here so the checklist matches the full kind list.';
  }
  return 'No trophies match these filters. Clear the search or widen the kind and grade filters.';
}

function render() {
  updateHeader();
  for (const button of document.querySelectorAll('[data-view]')) {
    button.setAttribute('aria-selected', String(button.dataset.view === state.view));
  }
  el('viewChecklist').hidden = state.view !== 'checklist';
  el('viewRoadmap').hidden = state.view !== 'roadmap';
  el('viewMissables').hidden = state.view !== 'missables';
  const ctx = {
    progress: state.progress,
    selectedName: state.selectedName,
    onToggle: (name) => { toggleEarned(state.progress, name); render(); },
    onCount: (name, value) => { setCount(state.progress, name, value); render(); },
    onSelect: (name) => { state.selectedName = name; render(); },
    onSelectTrophy: (name) => { state.selectedName = name; state.view = 'checklist'; render(); },
  };
  if (state.view === 'checklist') {
    renderChecklist(el('viewChecklist'), { ...ctx, trophies: currentList(), allTrophies: state.trophies, emptyMessage: emptyMessageFor() });
  } else if (state.view === 'roadmap') {
    renderRoadmap(el('viewRoadmap'), { ...ctx, trophies: state.trophies });
  } else {
    renderMissables(el('viewMissables'), { ...ctx, trophies: state.trophies });
  }
}

function fillSelect(select, options) {
  for (const option of options) {
    const node = document.createElement('option');
    node.value = option.value;
    node.textContent = option.label;
    select.append(node);
  }
}

function wireControls() {
  fillSelect(el('kindFilter'), KIND_OPTIONS);
  fillSelect(el('gradeFilter'), GRADE_OPTIONS);
  el('searchInput').addEventListener('input', (event) => { state.filters.query = event.target.value; state.view = 'checklist'; render(); });
  el('kindFilter').addEventListener('change', (event) => { state.filters.kind = event.target.value; state.view = 'checklist'; render(); });
  el('gradeFilter').addEventListener('change', (event) => { state.filters.grade = event.target.value; state.view = 'checklist'; render(); });
  el('earnedFilter').addEventListener('change', (event) => { state.filters.earned = event.target.value; state.view = 'checklist'; render(); });
  el('spoilerToggle').checked = state.progress.hideSpoilers;
  el('spoilerToggle').addEventListener('change', (event) => { state.progress.hideSpoilers = event.target.checked; saveProgress(state.progress); render(); });
  el('exportButton').addEventListener('click', () => exportProgress(state.progress));
  el('importInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state.progress = await importProgressFile(file);
      saveProgress(state.progress);
      el('spoilerToggle').checked = state.progress.hideSpoilers;
    } catch { /* a bad file leaves current progress untouched */ }
    event.target.value = '';
    render();
  });
  el('resetButton').addEventListener('click', () => {
    state.progress = { earned: [], counts: {}, hideSpoilers: state.progress.hideSpoilers };
    saveProgress(state.progress);
    el('spoilerToggle').checked = state.progress.hideSpoilers;
    render();
  });
  for (const button of document.querySelectorAll('[data-view]')) {
    button.addEventListener('click', () => { state.view = button.dataset.view; render(); });
  }
}

async function startApp() {
  state.trophies = await loadTrophies();
  if (!state.selectedName && state.trophies.length) {
    state.selectedName = 'Catch Me If You Can';
  }
  wireControls();
  render();
}

startApp();
