export function downloadCSV(csvContent, filename) {
  if (typeof csvContent !== 'string' || !csvContent) {
    console.error("Download error: Invalid or empty CSV content provided.");
    alert("Could not download file: No valid data was generated.");
    return;
  }
  console.log(csvContent);

  if (typeof filename !== 'string' || !filename) {
    console.warn("Download warning: No filename provided, using default check reference.");
    filename = `export_${new Date().toISOString().slice(0, 10)}.csv`;
  }

  // for tracking and cleaning up
  let objectUrl = null;

  try {
    console.log("Download: Creating new blob...");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    console.log(`Download: blob created (size: ${blob.size} bytes)`);

    objectUrl = URL.createObjectURL(blob);
    console.log(`Download: Object URL created: ${objectUrl}`);

    const link = document.createElement('a');
    link.setAttribute('href', objectUrl);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    console.log("Download: Triggering click...");
    link.click(); // wonky but it works
    console.log("Download: Removing link...");
    document.body.removeChild(link);

    console.log(`popup.js: Downloaded successfully for ${filename}`);
  } catch (error) {
    console.error("Download error during new Blob/Link creation or click:", error);
    alert(`Failed to prepare or trigger download: ${error.message}`);
  } finally {
    if (objectUrl) {
      console.log(`Download: Revoking Object URL: ${objectUrl}`);
      URL.revokeObjectURL(objectUrl);
    }
  }
}
