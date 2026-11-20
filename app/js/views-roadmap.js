// Renders the roadmap to the platinum: stages in order, each with the trophies
// it covers and whether each one is already earned.
import { ROADMAP_STAGES } from './roadmap-data.js';
import { isEarned } from './store.js';
import { trophyByName } from './data.js';

export function renderRoadmap(container, ctx) {
  container.replaceChildren();
  const intro = document.createElement('p');
  intro.textContent = 'The order to earn all 55 trophies, built from the official descriptions: story chapters and named missions first, missable set pieces protected by saves, then strands, activities, collections, counts and money, and 100 percent completion last. Tap a trophy to open it in the checklist.';
  container.append(intro);
  for (const stage of ROADMAP_STAGES) {
    const card = document.createElement('section');
    card.className = 'roadmap-stage';
    const when = document.createElement('div');
    when.className = 'stage-when';
    when.textContent = stage.when;
    const title = document.createElement('h3');
    title.textContent = stage.title;
    const summary = document.createElement('p');
    summary.textContent = stage.summary;
    const list = document.createElement('ul');
    let earnedCount = 0;
    for (const name of stage.trophies) {
      const trophy = trophyByName(ctx.trophies, name);
      const done = trophy ? isEarned(ctx.progress, name) : false;
      if (done) earnedCount += 1;
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = (done ? '✓ ' : '○ ') + name + (trophy && trophy.missable ? ' — MISSABLE' : '');
      button.addEventListener('click', () => ctx.onSelectTrophy(name));
      item.append(button);
      list.append(item);
    }
    const progressLine = document.createElement('p');
    progressLine.textContent = earnedCount + ' of ' + stage.trophies.length + ' earned in this stage.';
    card.append(when, title, summary, list, progressLine);
    container.append(card);
  }
}
