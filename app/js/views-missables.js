// Renders the missable trophies view: every flagged trophy with the moment
// it can be missed, why it is flagged, and a link into its full guide.
import { gradeLabel } from './data.js';
import { isEarned } from './store.js';

export function missableTrophies(trophies) {
  return trophies.filter((trophy) => trophy.missable === true);
}

export function renderMissables(container, ctx) {
  container.replaceChildren();
  const intro = document.createElement('p');
  intro.textContent = 'Every trophy this guide flags as missable, judged from its official description: a one-time location, a scripted encounter, a choice, or a second chance that a save file protects better than any walkthrough. No cited source confirms mission replay for these, so the safe play is a manual save before chapters and big missions, and doing each one the moment it appears.';
  container.append(intro);
  for (const trophy of missableTrophies(ctx.trophies)) {
    const card = document.createElement('section');
    card.className = 'missable-card';
    const title = document.createElement('h3');
    title.textContent = trophy.name + ' — ' + gradeLabel(trophy.grade) + (isEarned(ctx.progress, trophy.name) ? ' — Earned ✓' : '');
    const desc = document.createElement('p');
    desc.textContent = 'Official description: ' + trophy.description;
    const note = document.createElement('p');
    note.className = 'missable-note';
    note.textContent = trophy.missableNote ?? '';
    const open = document.createElement('button');
    open.type = 'button';
    open.textContent = 'Open the full guide ›';
    open.addEventListener('click', () => ctx.onSelectTrophy(trophy.name));
    card.append(title, desc, note, open);
    container.append(card);
  }
}
