const headshot = (id) => `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`;

const players = [
  { number: '1', name: 'Keaton Wagler', pos: 'G', size: '6\'6" / 175', exp: 'R', status: 'Available', id: '1643413', ppg: '12.5', rpg: '3.3', apg: '3.1' },
  { number: '3', name: 'Bradley Beal', pos: 'G', size: '6\'4" / 207', exp: '14', status: 'Out · knee management', id: '203078' },
  { number: '4', name: 'Kobe Sanders', pos: 'G-F', size: '6\'8" / 207', exp: '1', status: 'Available', id: '1642920' },
  { number: '5', name: 'Derrick Jones Jr.', pos: 'G-F', size: '6\'6" / 210', exp: '10', status: 'Available', id: '1627884', ppg: '11.0', rpg: '4.5', apg: '1.6' },
  { number: '7', name: 'Brandon Ingram', pos: 'F', size: '6\'8" / 190', exp: '10', status: 'Out · heel surgery', id: '1627742', ppg: '21.5', rpg: '5.1', apg: '4.8' },
  { number: '8', name: 'Kris Dunn', pos: 'G', size: '6\'3" / 205', exp: '10', status: 'Available', id: '1627739', ppg: '7.8', rpg: '4.2', apg: '5.6' },
  { number: '9', name: 'Gradey Dick', pos: 'G-F', size: '6\'7" / 200', exp: '3', status: 'Available', id: '1641711' },
  { number: '10', name: 'Darius Garland', pos: 'G', size: '6\'1" / 192', exp: '7', status: 'Available', id: '1629636', ppg: '21.2', rpg: '2.4', apg: '6.9' },
  { number: '11', name: 'Brook Lopez', pos: 'C', size: '7\'1" / 282', exp: '18', status: 'Available', id: '201572', ppg: '14.8', rpg: '5.4', apg: '1.8' },
  { number: '12', name: 'Nick Martinelli', pos: 'F', size: '6\'7" / 220', exp: 'R', status: 'TW · G League', id: '1643568', ppg: '2.8', rpg: '1.3', apg: '0.3' },
  { number: '14', name: 'Yanic Konan Niederhäuser', pos: 'C', size: '6\'11" / 242', exp: '1', status: 'Available', id: '1642949', ppg: '4.3', rpg: '2.9', apg: '0.3' },
  { number: '18', name: 'Baba Miller', pos: 'F', size: '6\'11" / 204', exp: 'R', status: 'Available', id: '1642394', ppg: '4.2', rpg: '2.2', apg: '0.8' },
  { number: '21', name: 'Jalen Pickett', pos: 'G', size: '6\'2" / 202', exp: '3', status: 'TW', id: '1641734' },
  { number: '22', name: 'Jordan Miller', pos: 'G-F', size: '6\'5" / 194', exp: '3', status: 'Out · shoulder surgery', id: '1631308' },
  { number: '23', name: 'Isaiah Jackson', pos: 'F-C', size: '6\'8" / 205', exp: '5', status: 'Available', id: '1630543', ppg: '8.3', rpg: '5.3', apg: '1.9' },
  { number: '24', name: 'Cam Christie', pos: 'G', size: '6\'5" / 190', exp: '2', status: 'TW', id: '1642266' },
  { number: '28', name: 'Rui Hachimura', pos: 'F', size: '6\'8" / 230', exp: '7', status: 'Available', id: '1629060', ppg: '13.3', rpg: '5.9', apg: '1.8' },
  { number: '31', name: 'Max Strus', pos: 'G-F', size: '6\'5" / 215', exp: '7', status: 'Available', id: '1629622' }
];

const byName = (name) => players.find((player) => player.name === name);
const lineups = {
  starters: ['Darius Garland', 'Kris Dunn', 'Derrick Jones Jr.', 'Rui Hachimura', 'Brook Lopez'],
  bench: ['Keaton Wagler', 'Kobe Sanders', 'Gradey Dick', 'Isaiah Jackson', 'Yanic Konan Niederhäuser']
};
const games = [
  { date: 'TUE, NOV 17 <i>•</i> FINAL', connector: 'AT', venue: 'DELTA CENTER', location: 'SALT LAKE CITY, UT', opponent: 'JAZZ', logo: 'UTA', record: '2–13', result: 'L 107–132' },
  { date: 'THU, NOV 19 <i>•</i> 5:00 PM PT', connector: 'AT', venue: 'FROST BANK CENTER', location: 'SAN ANTONIO, TX', opponent: 'SPURS', logo: 'SAS', record: '12–3 · 2nd West', result: '' },
  { date: 'SAT, NOV 21 <i>•</i> NEXT UP', connector: 'AT', venue: 'AMERICAN AIRLINES CENTER', location: 'DALLAS, TX', opponent: 'MAVERICKS', logo: 'DAL', record: 'SCHEDULE VIEW', result: '' }
];

const lineupGrid = document.querySelector('#lineupGrid');
const rosterTable = document.querySelector('#rosterTable');
const toast = document.querySelector('#toast');
const searchResults = document.querySelector('#searchResults');
const playerSearch = document.querySelector('#playerSearch');
let currentGame = 1;
let toastTimer;

function initials(name) { return name.split(' ').map((word) => word[0]).slice(0, 2).join(''); }
function imageMarkup(player, className, fallbackClass) {
  return `<img class="${className}" src="${headshot(player.id)}" alt="${player.name}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="${fallbackClass}" hidden>${initials(player.name)}</span>`;
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
function closePanels() { document.querySelectorAll('.quick-panel').forEach((panel) => { panel.hidden = true; }); }
function openPanel(id) { closePanels(); document.querySelector(`#${id}`).hidden = false; }
function playerStats(player) { return [player.ppg || '—', player.rpg || '—', player.apg || '—']; }

function renderLineup(kind = 'starters') {
  lineupGrid.innerHTML = lineups[kind].map((name) => {
    const player = byName(name);
    const [first, ...last] = player.name.split(' ');
    return `<button class="player-card" data-player="${player.name}" aria-label="Open ${player.name} player profile"><span class="player-number">${player.number}</span><div class="player-portrait">${imageMarkup(player, 'player-headshot', 'portrait-fallback')}<span class="position">${player.pos}</span></div><h4>${first}<br>${last.join(' ')}</h4><p>${player.size.replace(' / ', ' · ')}</p></button>`;
  }).join('');
}
function renderRoster() {
  rosterTable.innerHTML = players.map((player) => {
    const statusClass = player.status.startsWith('Out') ? 'out' : player.status === 'Available' ? 'available' : '';
    return `<tr><td><button class="roster-player" data-player="${player.name}"><span class="roster-number">${player.number}</span>${imageMarkup(player, 'roster-thumb', 'roster-thumb')}<span>${player.name}</span></button></td><td>${player.pos}</td><td>${player.size}</td><td>${player.exp}</td><td class="${statusClass}">${player.status}</td></tr>`;
  }).join('');
}
function showPlayer(player) {
  const [ppg, rpg, apg] = playerStats(player);
  document.querySelector('#playerModalContent').innerHTML = `<div class="profile-top"><img class="profile-headshot" src="${headshot(player.id)}" alt="${player.name}" onerror="this.style.display='none'"><div class="profile-ident"><p class="eyebrow">#${player.number} · ${player.pos} · ${player.status.toUpperCase()}</p><h2 id="playerModalName">${player.name}</h2><p>${player.size} · ${player.exp === 'R' ? 'ROOKIE' : `${player.exp} NBA YEARS`}</p></div></div><div class="profile-stats"><div class="profile-stat"><b>${ppg}</b><span>PPG</span></div><div class="profile-stat"><b>${rpg}</b><span>RPG</span></div><div class="profile-stat"><b>${apg}</b><span>APG</span></div></div><div class="profile-bio"><b>2026–27 PLAYER SNAPSHOT</b><br />Official Clippers roster listing: ${player.pos}, ${player.size}, ${player.exp === 'R' ? 'rookie season' : `${player.exp} years of experience`}.<br /><a class="profile-link" target="_blank" rel="noreferrer" href="https://www.nba.com/player/${player.id}">Open official NBA profile ↗</a></div>`;
  openPanel('playerModal');
}
function renderSearch(query = '') {
  const matches = players.filter((player) => player.name.toLowerCase().includes(query.trim().toLowerCase()));
  searchResults.innerHTML = matches.length ? matches.map((player) => `<button class="search-result" data-player="${player.name}">${imageMarkup(player, '', 'roster-thumb')}<span><b>${player.name}</b><span>#${player.number} · ${player.pos} · ${player.status}</span></span></button>`).join('') : '<p class="empty-search">No current Clippers match that search.</p>';
}
function updateGame(index) {
  currentGame = (index + games.length) % games.length;
  const game = games[currentGame];
  document.querySelector('#gameDate').innerHTML = game.date;
  document.querySelector('#gameConnector').textContent = game.connector;
  document.querySelector('#gameVenue').textContent = game.venue;
  document.querySelector('#gameLocation').textContent = game.location;
  document.querySelector('#opponentName').textContent = game.opponent;
  document.querySelector('#opponentLogo').textContent = game.logo;
  document.querySelector('#opponentRecord').textContent = game.result || game.record;
  notify(currentGame === 1 ? 'Back to today’s game.' : `Loaded ${game.opponent} game details.`);
}
function openExternal(url) { window.open(url, '_blank', 'noopener,noreferrer'); }

renderLineup();
renderRoster();
renderSearch();

document.querySelector('#refreshButton').addEventListener('click', (event) => { event.currentTarget.textContent = '✓ Snapshot refreshed'; notify('The static dashboard snapshot was refreshed.'); setTimeout(() => { event.currentTarget.textContent = '↻ Refresh data'; }, 2400); });
document.querySelector('#reminderButton').addEventListener('click', (event) => { const enabled = event.currentTarget.classList.toggle('is-set'); event.currentTarget.textContent = enabled ? '✓ Reminder set' : '＋ Set reminder'; notify(enabled ? 'Game reminder added for 4:30 PM PT.' : 'Game reminder removed.'); });
document.querySelector('#searchButton').addEventListener('click', () => { openPanel('searchPanel'); playerSearch.focus(); });
document.querySelector('#notificationButton').addEventListener('click', () => openPanel('notificationPanel'));
document.querySelector('#accountButton').addEventListener('click', () => openPanel('accountPanel'));
document.querySelector('#previousGame').addEventListener('click', () => updateGame(currentGame - 1));
document.querySelector('#nextGame').addEventListener('click', () => updateGame(currentGame + 1));
document.querySelector('#scheduleButton').addEventListener('click', () => openExternal('https://www.nba.com/clippers/schedule'));
document.querySelector('#statsButton').addEventListener('click', () => openExternal('https://www.nba.com/team/1610612746/traditional'));
document.querySelector('#standingsButton').addEventListener('click', () => openExternal('https://www.nba.com/standings'));
document.querySelector('#standingsMenu').addEventListener('click', () => notify('Standings are a Nov. 19 snapshot. Open the full standings for live positions.'));
document.querySelector('#newsButton').addEventListener('click', () => openExternal('https://www.nba.com/clippers/news'));
document.querySelector('#newsFilter').addEventListener('click', (event) => { const compact = event.currentTarget.classList.toggle('is-compact'); event.currentTarget.textContent = compact ? 'LATEST ONLY⌃' : 'ALL POSTS⌄'; document.querySelector('.news-panel').classList.toggle('compact-feed', compact); notify(compact ? 'Showing the latest team report.' : 'Showing all team reports.'); });
document.querySelector('#markReadButton').addEventListener('click', () => { document.querySelector('.notification b').style.display = 'none'; notify('Notifications marked as read.'); closePanels(); });
document.querySelector('#alertToggle').addEventListener('change', (event) => notify(event.currentTarget.checked ? 'Game-day alerts are on.' : 'Game-day alerts are off.'));
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', closePanels));
document.querySelectorAll('.quick-panel').forEach((panel) => panel.addEventListener('click', (event) => { if (event.target === panel) closePanels(); }));
document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => { document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active')); link.classList.add('active'); }));
document.querySelectorAll('.toggle button').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.toggle button').forEach((item) => item.classList.remove('active')); button.classList.add('active'); renderLineup(button.dataset.lineup); notify(button.dataset.lineup === 'bench' ? 'Bench unit loaded.' : 'Projected starters loaded.'); }));
lineupGrid.addEventListener('click', (event) => { const card = event.target.closest('[data-player]'); if (card) showPlayer(byName(card.dataset.player)); });
rosterTable.addEventListener('click', (event) => { const row = event.target.closest('[data-player]'); if (row) showPlayer(byName(row.dataset.player)); });
searchResults.addEventListener('click', (event) => { const result = event.target.closest('[data-player]'); if (result) showPlayer(byName(result.dataset.player)); });
playerSearch.addEventListener('input', (event) => renderSearch(event.target.value));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePanels(); });
