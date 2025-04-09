const TABLE_SELECTOR = ".table.target-audience-table";

// helpers
/**
return null
**/
function getRowsToExport(type) {
  const tableBody = document.querySelector(`${TABLE_SELECTOR} tbody`);
  if (!tableBody) {
    console.error("getRowsToExport: Could not find table body.");
    alert("Alert: Could not find a valid table.");
    // we can create something on the ui instead of alert.
    return null
  }

  const allRows = tableBody.querySelector("tr.list-items");

  // please rm to check on type return
  if (type === 'selected') {
    // could be prompted for index so keep in mind else eh
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
    if (allRows === 0) {
      console.warn("Export: No rows found in the table");
      alert("No route data rows found in the table.")
      return null
    }
    return allRows; // type NodeList
  }
}

/**
return []
**/
function extractDataFromRows(rowsNodeList) {
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
      console.warn("Export: Found a row with unexpected cell count.", row);
    }
  });
  return data;
}

function scrapeAndExport(exportType) {
  return exportType; // each btn can determine context
}

// main logic - check reference
function main() {
  return 0;
}
