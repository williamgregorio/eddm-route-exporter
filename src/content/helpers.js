const TABLE_SELECTOR = 'table.target-audience-table';

/**
* Returns an a NodeListOf<Element> or Element[] if selection is true.
* @example 
* if type -> selected (user wants all data rows into their system clipboard)
* if type -> copySelected (user has used checkbox as true and wants this data rows into their system clipboard)
* @param {string} type - e.g (selected, copySelected)
* @returns {NodeListOf<Element>}
*/
export function getRowsToExport(type) {
  const tableBodyNodeList = document.querySelectorAll(`${TABLE_SELECTOR} tbody`);
  if (!tableBodyNodeList || tableBodyNodeList.length === 0) {
    console.error("getRowsToExport: Could not find table body.");
    alert("Warning: Could not find a table.");
    return null
  }

  const tableBody = tableBodyNodeList[0];
  const allRows = tableBody.querySelectorAll("tr.list-items");

  if (type === 'selected' || type === 'copySelected') {
    const selectedRows = Array.from(allRows).filter(row => {
      const checkbox = row.querySelector("td:first-child input.routeChex");
      return checkbox && checkbox.checked
    });

    if (selectedRows.length === 0) {
      console.warn("Export: No rows selected.");
      return null;
    }

    return selectedRows;
  } else {
    if (allRows.length === 0) {
      console.warn("Export: No rows found in the table");
      return null
    }
    return allRows;
  }
}

/**
* Accepts NodeList to build row body as length from headers of table body.
* @param {NodeList} rowsNodeList 
* @returns {any[][]} 
*/
export function extractDataFromRows(rowsNodeList) {
  const data = [];
  const table = document.querySelector(TABLE_SELECTOR);
  if (!table) {
    console.error("extractDataFromRows: Could not find table.");
    return [];
  }

  const headerCells = table.querySelectorAll('thead th');
  if (headerCells.length > 1) {
    let headers = Array.from(headerCells).slice(1);
    
    function isBusinessHeaderDisplayed(headers) {
      for (let i = 0; i < headers.length; i++) {
        let th = headers[i];
        if (th.id === "businessTableHeader" && th.style.display === "") {
          return true;
        }
      }
      return false;
    }

    function trimText(text) {
      return text.textContent.trim();
    }

    const residentialAndBusinessHeaders = headers.map(th => {
      return trimText(th)
    })

    const residentialHeaders = headers.filter(th => th.id !== "businessTableHeader").map(th => {
      return trimText(th)
    })

    if (isBusinessHeaderDisplayed(headerCells)) {
      data.push(residentialAndBusinessHeaders);
    } else {
      data.push(residentialHeaders);
    }
  } else {
    console.warn("Export: Could not find enough header cells.");
  }

  const rows = Array.from(rowsNodeList);
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length > 2) {
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

/**
*
* @param {string[][]} dataArray
* @returns {string} - In hopes of a formatted csv string
*/
export function convertToCSV(dataArray) {
  return dataArray.map(row =>
    row.map(cell => {
      const cellText = cell.replace(/"/g, '""');
      if (cellText.includes(',') || cellText.includes('"') || cellText.includes('\n')) {
        return `"${cellText}"`;
      }
      return cellText;
    }).join(',')
  ).join('\n');
}
