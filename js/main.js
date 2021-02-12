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



const createTable = () => {
  const table = document.createElement('table');
  const tableHeader = document.createElement('thead');
  const tableHeaderRow = document.createElement('tr');
  table.appendChild(tableHeader);
  tableHeader.appendChild(tableHeaderRow);
  SPREADSHEET_WRAPPER.appendChild(table);
  for (let columnIndex = 0; columnIndex < COLUMN_COUNT; columnIndex++) {
    const th = document.createElement('th');
    th.textContent = convertHeaderNumber(columnIndex);
    tableHeader.appendChild(th);
    const row = createRow(columnIndex);
    table.appendChild(row);
  }
}

const createRow = (columnIndex) => {
  const tableRow = document.createElement('tr');
  for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex++) {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.setAttribute('data-row-index', rowIndex);
    input.setAttribute('data-column-index', columnIndex);
    input.addEventListener('change', (evt) => setTableValues(evt.target));
    td.appendChild(input)
    tableRow.appendChild(td);
  }
  return tableRow;
}

const setTableValues = (element) => {
  const value = element.value;
  const rowIndex = element.getAttribute('data-row-index');
  const columnIndex = element.getAttribute('data-column-index');
  TABLE_VALUES.push({
    row: rowIndex,
    columnIndex: columnIndex,
    value: value,
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
  console.log(columnIndex, indexToRemove);
  console.log(LETTER_MAP[columnIndex]);
  // -1 since the map is 0 indexed.
  return `${LETTER_MAP[leadingNumber - 1]}${LETTER_MAP[columnIndex]}`;
}

REDRAW_BUTTON.addEventListener('click', () => {
  SPREADSHEET_WRAPPER.querySelector('table').remove();
  createTable();
});
createTable();
