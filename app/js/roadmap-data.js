// The roadmap to the platinum: stages built from the official trophy descriptions —
// story chapters and named missions first, then strands, activities, collections,
// counts, money, and finally 100 percent completion and the platinum itself.
export const ROADMAP_STAGES = [
  {
    id: 'opening',
    title: 'Stage 1 — Opening and Chapter 1',
    when: 'Start of the story',
    summary: 'Begin a new game, finish the opening mission Gone Fishing and all of Chapter 1. On your first visit to Ocean Beach, stop for the cocktail moment: its trophy name echoes the opening and no source confirms it repeats.',
    trophies: ['Just Like Paradise', 'Paradise Lost', 'Trust', 'In The Beginning…'],
  },
  {
    id: 'chapters-2-4',
    title: 'Stage 2 — Chapters 2 to 4 and the named missions',
    when: 'Main story, first half',
    summary: 'Push the campaign through Chapters 2, 3 and 4 and the named missions the official list ties to them, including The Cartel Heist. Keep one manual save before each chapter ends from here on.',
    trophies: ['T**s Ass Drug Money', 'Vice City, Baby!', 'Top Of The World, Ma', 'Break the Bank', 'Family Matters', 'DWNFALL'],
  },
  {
    id: 'finale-approach',
    title: 'Stage 3 — Airport, set pieces and the final mission',
    when: 'Main story, second half',
    summary: 'The missable heart of the run. At VCIA, earn the unscheduled departure during VCIA Takedown; engage Rhinos when they appear; smash out of any showroom a mission puts you in; answer choices instead of skipping them; and take second chances instead of reloading. Then finish the final mission.',
    trophies: ['Hi-Jacked', 'Catch Me If You Can', 'Snow Storm', 'Challenging Tank', 'Capital Offense', 'Actions Speak Louder', 'Bad Luck, I Guess', 'You Gotta Know When to Get Off'],
  },
  {
    id: 'strangers',
    title: 'Stage 4 — Strangers and their final missions',
    when: 'Alongside and after the story',
    summary: 'Complete stranger strands in full: the finales for Andy, Kenton, Billy, Randy and Tyrone are five of the 8 strands Strangers & Freaks requires, so finish those five first, then three more strands. Bret’s unique-animal hunt belongs to this stage too.',
    trophies: ['Road to Rehabilitation', 'This Was No Boat Accident', 'The Lone Rider', 'Supply & Demand', 'Spin On This!', 'Strangers & Freaks', 'Fair Game'],
  },
  {
    id: 'activities-sampler',
    title: 'Stage 5 — Sample every activity once',
    when: 'Whenever the map offers them',
    summary: 'Try each of the 9 activity types once for Master of None: fishing against Cal, one full arcade game, bowling at the Kolt & Associates alley, and challenges as they appear on the way to 50.',
    trophies: ['Master of None', 'Baited My Tackle', 'Stick Fiddler', 'Let’s Go Bowling', 'One Last Thing'],
  },
  {
    id: 'collections',
    title: 'Stage 6 — Collections and full exploration',
    when: 'Endgame sweep, region by region',
    summary: 'Clear the sets and the map: 3 Collectible Card sets, WAiNK It at 100 locations, 18 meditation spots, 100 discovered vehicles, all 52 areas of Leonida, then spend the money stage’s earnings on all 8 garage properties and register 10 kept vehicles in the Scooter Bros app.',
    trophies: ['Positive Mental Attitude', "Don't Touch My Deck", 'You WAiNKer!', 'Whip It Good', 'The Goodtime State', 'Little Boxes', 'On the Spot'],
  },
  {
    id: 'skill-counts',
    title: 'Stage 7 — Skill checks and stunt counts',
    when: 'Endgame, at your own pace',
    summary: 'The long skill grinds: gold in all 42 Shooting Range challenges, a Top Fun drone race win at all 14 locations, wins in 20 different races, and 250 stunts — most of which you should already have banked by taking stunt chances during the story.',
    trophies: ['Cunning Stunts', 'The Shootist', 'Top Fun', 'Earn Cash, Not Kudos'],
  },
  {
    id: 'crime-money',
    title: 'Stage 8 — Crime, partners and money',
    when: 'Free roam, planned routes',
    summary: 'Partner and heist one-offs plus the money trophies: lose a 4-star wanted level together, rob 3 shops back-to-back, rob a jewelry store unseen, 5 bank vaults with escapes, an armored truck, one illegal operation for each of the 9 gangs, 5 enemies in one Combat Focus, a melee drive-by, then launder $250,000 of Marked Bills and spend $100,000 across shops.',
    trophies: ['Hot Together', 'Retail Therapy', 'Sneakthief', 'Maximum Withdrawal', 'A Classic Blitz Play', 'Pest Control', 'Gunslinger', 'Ten Pin', 'Personal Best', 'The Truth Is Out There', 'Dime on the Dollar', 'Treat Yo Self'],
  },
  {
    id: 'platinum',
    title: 'Stage 9 — 100 percent and the platinum',
    when: 'The finish line',
    summary: 'With every other stage cleared, close out 100 percent completion for A Long Road. The platinum, Vice Got a Price!, then unlocks on its own: it needs all other 54 trophies and nothing else.',
    trophies: ['A Long Road', 'Vice Got a Price!'],
  },
];

export function roadmapCoverage(stages) {
  return stages.reduce((total, stage) => total + stage.trophies.length, 0);
}
