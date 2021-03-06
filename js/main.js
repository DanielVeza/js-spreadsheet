const ROW_COUNT = 100;
const COLUMN_COUNT = 100;
const SPREADSHEET_WRAPPER = document.getElementById('js-spreadsheet');
const REDRAW_BUTTON = document.getElementById('js-redraw');
const TABLE_VALUES = [];
const LETTER_MAP = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J',
  10: 'K',
  11: 'L',
  12: 'M',
  13: 'N',
  14: 'O',
  15: 'P',
  16: 'Q',
  17: 'R',
  18: 'S',
  19: 'T',
  20: 'U',
  21: 'V',
  22: 'W',
  23: 'X',
  24: 'Y',
  25: 'Z'
};

/**
 * Draw the table wrapper.
 */
const createTable = () => {
  const table = document.createElement('table');
  const tableHeader = document.createElement('thead');
  const tableHeaderRow = document.createElement('tr');
  const tableBody = document.createElement('tbody');
  table.appendChild(tableHeader);
  tableHeader.appendChild(tableHeaderRow);
  SPREADSHEET_WRAPPER.appendChild(table);
  // Create first empty column.
  const th = document.createElement('th');
  tableHeader.appendChild(th);
  for (let columnIndex = 0; columnIndex < COLUMN_COUNT; columnIndex++) {
    const th = document.createElement('th');
    th.textContent = convertHeaderNumber(columnIndex);
    tableHeader.appendChild(th);
    const row = createRow(columnIndex);
    tableBody.appendChild(row);
  }
  table.appendChild(tableBody);
}

/**
 * Draw each row and cell, adding in values where they exist.
 * @param columnIndex
 * @return {HTMLTableRowElement}
 */
const createRow = (columnIndex) => {
  const tableRow = document.createElement('tr');
  const td = document.createElement('td');
  td.textContent = columnIndex;
  tableRow.appendChild(td);
  for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex++) {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.setAttribute('data-row-index', rowIndex);
    input.setAttribute('data-column-index', columnIndex);
    const cellExistingValue = checkForCellValue(rowIndex, columnIndex);
    if (cellExistingValue.length > 0) {
      // 0 seems a little hacky, but is safe here.
     input.value = cellExistingValue[0].value;
    }
    input.addEventListener('change', (evt) => setTableValues(evt.target));
    td.appendChild(input)
    tableRow.appendChild(td);
  }
  return tableRow;
}

/**
 * Check if a cell already has a value.
 *
 * @param rowIndex
 * @param columnIndex
 * @return {*[]}
 */
const checkForCellValue = (rowIndex, columnIndex) => {
  return TABLE_VALUES.filter((value) => {
    return value.row === rowIndex && value.column === columnIndex;
  });
}

/**
 * Set or Update a table value.
 * @param element
 */
const setTableValues = (element) => {
  const value = element.value;
  const rowIndex = Number(element.getAttribute('data-row-index'));
  const columnIndex = Number(element.getAttribute('data-column-index'));
  const tableValueExists = getTableValueIfExists(rowIndex, columnIndex);
  if (tableValueExists !== -1) {
    // Remove the existing value.
    TABLE_VALUES.splice(tableValueExists, 1);
  }
  TABLE_VALUES.push({
    row: Number(rowIndex),
    column: Number(columnIndex),
    value: value,
  });
}

/**
 * Check if a value already exists for a table cell.
 * @param rowIndex
 * @param columnIndex
 * @return {number}
 */
const getTableValueIfExists = (rowIndex, columnIndex) => {
  return TABLE_VALUES.findIndex((value) => {
    return value.row === rowIndex && columnIndex === value.column;
  });
}

/**
 * Convert a number into an excel style Header ID.
 *
 * 0 = A, 26 = AA, 51 = BA
 *
 * @param columnIndex
 */
const convertHeaderNumber = (columnIndex) => {
  // No need for a lead letter, return early.
  if (columnIndex < 26) {
    return LETTER_MAP[columnIndex];
  }
  const leadingNumber = Math.floor(columnIndex / 26);
  const indexToRemove = 26 * leadingNumber;
  columnIndex -= indexToRemove;
  // -1 since the map is 0 indexed.
  return `${LETTER_MAP[leadingNumber - 1]}${LETTER_MAP[columnIndex]}`;
}

// Redraw the table when clicked.
REDRAW_BUTTON.addEventListener('click', () => {
  const table = SPREADSHEET_WRAPPER.querySelector('table');
  // The remove and redraw takes a few secs, so lets hide the table until the new one is redrawn.
  table.classList.add('hidden');
  table.remove();
  // This is silly. You get no feedback on the refresh without this.
  setTimeout(() => createTable(), 250);
});

createTable();
