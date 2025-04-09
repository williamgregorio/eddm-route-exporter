/**
return a trigger for csv dowload
**/
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function scrapeAndExport(exportType) {
  console.log(`USPS EDDM Export: Starting to export for type ${exportType}`);
  const rowsToExport = getRowsToExport(exportType);

  if (!rowsToExport) {
    return;
  }

  const data = extractDataFromRows(rowsToExport);
  if (data.length <= 1) {
    console.warn("Export: No data extracted or only headers found.");
    // alert is shown in getRowsToExport or extractDataFromRows but ui support would be cool
    return;
  }
  const csvString = convertToCSV(data);
  const filename = `eddm_export_${exportType}_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadCSV(csvString, filename);
  console.log(`USPS EDDM Export: CSV download triggered for ${filename}`);
}

// main logic - check reference
// make sure button name convention matches else this will fail
function main() {
  document.getElementById("exportSelectedBtn").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeAndExport,
      args: ['selected']
    });
  });

  document.getElementById("exportAllBtn").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeAndExport,
      args: ['all']
    });
  });

}

main();
