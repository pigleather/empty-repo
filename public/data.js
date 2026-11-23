// data.js – Loads all CSVs in the repo and renders them into HTML tables.
// Requires: <https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js>

const csvFiles = ['all_teams.csv', 'games.csv'];

function renderTable(title, header, rows) {
  const tbl = document.createElement('table');
  // Title row
  const titleRow = document.createElement('tr');
  const thTitle = document.createElement('th');
  thTitle.setAttribute("colspan", String(header.length));
  thTitle.textContent = title;
  titleRow.appendChild(thTitle);
  tbl.appendChild(titleRow);

  // Header row
  const headerRow = document.createElement('tr');
  for (const h of header) {
    const th = document.createElement('th');
    th.textContent = h;
    headerRow.appendChild(th);
  }
  tbl.appendChild(headerRow);

  // Data rows
  for (const r of rows) {
    const tr = document.createElement('tr');
    for (const c of r) {
      const td = document.createElement('td');
      td.textContent = c;
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }

  return tbl;
}

function loadCsv(path, cb) {
  fetch(path)
    .then(r => r.text())
    .then(txt => {
      const data = Papa.parse(txt, { header: true, skipEmptyLines: true });
      cb(data);
    });
}

async function init() {
  const container = document.getElementById('tables');
  loadCsv('all_teams.csv', data => {
    const rows = data.data.map(r => Object.values(r));
    const header = Object.keys(data.data[0]);
    container.appendChild(renderTable('All Teams', header, rows));
  });

  loadCsv('games.csv', data => {
    const rows = data.data.map(r => Object.values(r));
    const header = Object.keys(data.data[0]);
    container.appendChild(renderTable('Games', header, rows));
  });
}
init();