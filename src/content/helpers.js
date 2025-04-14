const TABLE_SELECTOR = 'table.target-audience-table';

export function getRowsToExport(type) {
  const tableBodies = document.querySelectorAll(`${TABLE_SELECTOR} tbody`);
  if (!tableBodies || tableBodies.length === 0) {
    console.error("getRowsToExport: Could not find table body.");
    alert("Alert: Could not find a valid table.");
    // we can create something on the ui instead of alert.
    return null
  }

  const tableBody = tableBodies[0];
  const allRows = tableBody.querySelectorAll("tr.list-items");

  if (type === 'selected') {
    const selectedRows = Array.from(allRows).filter(row => {
      const checkbox = row.querySelector("td:first-child input.routeChex");
      return checkbox && checkbox.checked // refer to reference
    });
    if (selectedRows.length === 0) {
      console.warn("Export: No rows selected.");
      alert("No routes are currently selected. Please check the boxes next to the routes you want to export.");
      return null;
    }
    return selectedRows;
  } else {
    if (allRows.length === 0) {
      console.warn("Export: No rows found in the table");
      alert("No route data rows found in the table.")
      return null
    }
    return allRows; // type NodeList
  }
}
export function extractDataFromRows(rowsNodeList) {
  const data = [];
  const table = document.querySelector(TABLE_SELECTOR);
  if (!table) {
    console.error("extractDataFromRows: Could not find table.");
    return [];
  }

  // refer to refernce - thead
  const headerCells = table.querySelectorAll('thead th');
  if (headerCells.length > 1) {
    // skip the first header of type (checkbox) and clean up
    const headers = Array.from(headerCells).slice(1).map(th =>
      th.textContent.replace(/\s+/g, ' ').trim()
    );
    data.push(headers);
  } else {
    console.warn("Export: Could not find enough header cells.");
  }

  // body row data
  // reference - from NodeList to Array
  const rows = Array.from(rowsNodeList);
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length > 2) {
      // may expect checkbox cell, data cells, and maybe a trailing empty one in reference
      // skip first cell of type (checkbox), and potentially skip last cell if it's empty
      // dynamically matches the number of data cells to the number of headers found
      const numberOfHeaders = data[0]?.length || cells.length - 2;
      const rowData = Array.from(cells)
        .slice(1, 1 + numberOfHeaders)
        .map(cell => cell.textContent.trim());
      data.push(rowData);
    } else {
      return null;
    }
  });
  return data;
}
export function convertToCSV(dataArray) {
  return dataArray.map(row =>
    row.map(cell => {
      const cellText = cell.replace(/"/g, '""');
      if (cellText.includes(',') || cellText.includes('"') || cellText.includes('\n')) {
        return `"${cellText}"`; // enclose ""
      }
      return cellText;
    }).join(',')
  ).join('\n');
}
