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
      console.warn("Exporter: No rows found in the table");
      alert("No route data rows found in the table.")
      return null
    }
    return allRows; // type NodeList
  }
}

function scrapeAndExport(exportType) {
  return exportType; // each btn can determine context
}

// main logic - check reference
function main() {
  return 0;
}
