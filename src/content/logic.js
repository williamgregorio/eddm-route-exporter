import { getRowsToExport, extractDataFromRows, convertToCSV } from './helpers.js';

export function scrapeAndExport(exportType) {
  const rowsToExport = getRowsToExport(exportType);

  if (!rowsToExport) {
    return null;
  }

  const data = extractDataFromRows(rowsToExport);

  if (data.length <= 1) {
    console.warn("Export: No data extracted or only headers found.");
    return null;
  }
  const csvString = convertToCSV(data);
  const filename = `eddm_export_${exportType}_${new Date().toISOString().slice(0, 10)}.csv`;
  console.log(`USPS EDDM Export: CSV generated.`);
  return csvString;
}
