/* data.js – loads CSVs, builds a DataTable, and shows a modal on row click */

/* ------------------------------------------------------------------ */
/* Configuration                                                     */
/* ------------------------------------------------------------------ */
const csvFiles = ['all_teams.csv', 'games.csv'];   // files to load

/* ------------------------------------------------------------------ */
/* Helper: fetch CSV via PapaParse                                 */
/* ------------------------------------------------------------------ */
function loadCsv(path, callback) {
  fetch(path)
    .then(r => r.text())
    .then(txt => {
      const data = Papa.parse(txt, { header: true, skipEmptyLines: true });
      callback(data);
    })
    .catch(err => console.error('Failed to load', path, err));
}

/* ------------------------------------------------------------------ */
/* Helper: build a DataTable from parsed CSV                      */
/* ------------------------------------------------------------------ */
function renderDataTable(title, data) {
  const tableId = `table-${title.replace(/\s+/g, '-')}`;   // unique id

  /* Build header row */
  const headerRow = $('<tr>');
  Object.keys(data.data[0]).forEach(key => {
    headerRow.append($('<th>').text(key));
  });

  /* Build body rows (each <tr> gets a data-attribute for easy retrieval) */
  const tbodyRows = data.data.map(rowObj => {
    const tr = $('<tr>');
    Object.values(rowObj).forEach(val => {
      tr.append($('<td>').text(val));
    });
    // Store the whole row in a JSON string on the <tr>
    tr.attr('data-row', JSON.stringify(rowObj));
    return tr;
  });

  /* Assemble the table */
  const tbl = $(`<table id="${tableId}" class="display" style="width:100%"></table>`);
  tbl.append($('<thead>').append(headerRow));
  tbl.append($('<tbody>').append(tbodyRows));

  /* Wrap with a container that has a title */
  const container = $('<div>');
  container.append(`<h3>${title}</h3>`).append(tbl);

  return { container, tableId };
}

/* ------------------------------------------------------------------ */
/* Main: load both CSVs, render tables and attach modal logic   */
/* ------------------------------------------------------------------ */
$(function () {
  /* Container that will hold all tables */
  const $tables = $('#tables');

  csvFiles.forEach(csv => {
    loadCsv(csv, data => {
      const { container, tableId } = renderDataTable(csv.replace('.csv', '').replace(/_/g, ' ').toUpperCase(), data);
      $tables.append(container);

      /* Initialise DataTables – it gives sorting, filtering, pagination */
      $(`#${tableId}`).DataTable();

      /* Row click: open modal with all details for that row */
      $(`#${tableId} tbody tr`).on('click', function () {
        const rowData = JSON.parse($(this).attr('data-row'));
        const bodyHtml = Object.entries(rowData)
          .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`) 
          .join('');
        $('#modalBody').html(`<table class="table"><tbody>${bodyHtml}</tbody></table>`);

        /* Show modal */
        const modal = new bootstrap.Modal(document.getElementById('rowModal'));
        modal.show();
      });
    });
  });
});